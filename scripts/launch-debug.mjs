/* eslint-disable unicorn/no-process-exit */
/**
 * Launch a HERE Core (OpenFin) manifest with Chrome DevTools Protocol enabled and stream
 * the console output of every window/view to stdout.
 *
 * The manifest served by the project is fetched, patched with --remote-debugging-port and
 * a unique --security-realm, then re-served from a local port so the original manifest in
 * the repo is left untouched.
 *
 * Usage:
 *   node scripts/launch-debug.mjs <projectDir> <manifestUrl> [--cdp-port=9222] [--duration=30]
 */
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const flag = (name, fallback) => {
	const match = args.find((a) => a.startsWith(`--${name}=`));
	return match ? match.split("=")[1] : fallback;
};

const projectDir = resolve(positional[0] ?? ".");
const manifestUrl = positional[1];
const cdpPort = Number(flag("cdp-port", 9222));
const manifestPort = Number(flag("manifest-port", cdpPort + 1));
const duration = Number(flag("duration", 0));

if (!manifestUrl) {
	console.error("Usage: node scripts/launch-debug.mjs <projectDir> <manifestUrl> [--cdp-port=9222] [--duration=30]");
	process.exit(1);
}

// The HERE node adapter lives in each framework project, not at the repo root.
const require = createRequire(`${projectDir}/package.json`);
const { connect, launch } = require("@openfin/node-adapter");

const sleep = async (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch the project manifest and patch it for debugging.
 * @param url The manifest to fetch.
 * @returns The patched manifest.
 */
async function patchManifest(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Could not fetch manifest ${url} (${response.status}). Is the dev server running ?`);
	}
	const manifest = await response.json();
	const existing = manifest.runtime?.arguments ?? "";
	const stripped = existing
		.split(" ")
		.filter((a) => a && !a.startsWith("--remote-debugging-port") && !a.startsWith("--security-realm"))
		.join(" ");
	// A dedicated realm keeps this debug instance isolated from any already running instance.
	manifest.runtime.arguments =
		`${stripped} --security-realm=cdp-debug-${cdpPort} --remote-debugging-port=${cdpPort}`.trim();
	return manifest;
}

/**
 * Serve the patched manifest so the RVM can launch it.
 * @param manifest The patched manifest.
 * @returns The url the manifest is served from.
 */
async function serveManifest(manifest) {
	const body = JSON.stringify(manifest);
	const server = createServer((_, res) => {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(body);
	});
	await new Promise((done) => server.listen(manifestPort, "127.0.0.1", done));
	return { url: `http://127.0.0.1:${manifestPort}/manifest.fin.json`, server };
}

/**
 * Wait for the CDP endpoint to come up.
 * @returns The list of targets.
 */
async function waitForCdp() {
	for (let i = 0; i < 60; i++) {
		try {
			const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
			if (res.ok) {
				return await res.json();
			}
		} catch {
			// Runtime not listening yet.
		}
		await sleep(1000);
	}
	throw new Error(`CDP endpoint did not come up on port ${cdpPort}`);
}

const attached = new Set();

/**
 * Format a CDP remote object for display.
 * @param arg The remote object.
 * @returns The displayable text.
 */
function formatArg(arg) {
	if (arg.unserializableValue !== undefined) {
		return String(arg.unserializableValue);
	}
	if (arg.value !== undefined) {
		return typeof arg.value === "string" ? arg.value : JSON.stringify(arg.value);
	}
	return arg.description ?? arg.type;
}

/**
 * Attach to a CDP target and stream its console output.
 * @param target The target to attach to.
 */
function attachToTarget(target) {
	if (attached.has(target.id) || !target.webSocketDebuggerUrl) {
		return;
	}
	attached.add(target.id);

	const label = target.title || target.url;
	const socket = new WebSocket(target.webSocketDebuggerUrl);
	let id = 0;
	const send = (method, params) => socket.send(JSON.stringify({ id: ++id, method, params }));

	socket.addEventListener("open", () => {
		console.log(`[attached] ${label} :: ${target.url}`);
		send("Runtime.enable");
		send("Log.enable");
	});

	socket.addEventListener("message", (event) => {
		const message = JSON.parse(event.data);
		if (message.method === "Runtime.consoleAPICalled") {
			const text = message.params.args.map(formatArg).join(" ");
			console.log(`[${label}] console.${message.params.type}: ${text}`);
		} else if (message.method === "Log.entryAdded") {
			const entry = message.params.entry;
			console.log(`[${label}] log.${entry.level}: ${entry.text}${entry.url ? ` (${entry.url})` : ""}`);
		} else if (message.method === "Runtime.exceptionThrown") {
			const details = message.params.exceptionDetails;
			const text = details.exception?.description ?? details.text;
			console.log(`[${label}] exception: ${text}`);
		}
	});

	socket.addEventListener("close", () => attached.delete(target.id));
	socket.addEventListener("error", () => attached.delete(target.id));
}

/**
 * Poll the CDP target list so views created after startup are also captured.
 */
async function pollTargets() {
	for (;;) {
		try {
			const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
			if (res.ok) {
				for (const target of await res.json()) {
					if (target.type === "page") {
						attachToTarget(target);
					}
				}
			}
		} catch {
			// Runtime has gone away.
		}
		await sleep(2000);
	}
}

console.log(`Manifest    : ${manifestUrl}`);
console.log(`CDP port    : ${cdpPort}`);
console.log();

const manifest = await patchManifest(manifestUrl);
const served = await serveManifest(manifest);
console.log(`Launching patched manifest from ${served.url}`);
const adapterPort = await launch({ manifestUrl: served.url });

const fin = await connect({
	uuid: `cdp-debug-${Date.now()}`,
	address: `ws://127.0.0.1:${adapterPort}`,
	nonPersistent: true,
});

let quitRequested = false;
const quit = async () => {
	if (quitRequested) {
		return;
	}
	quitRequested = true;
	try {
		const uuid = manifest.platform?.uuid ?? manifest.startup_app?.uuid;
		if (manifest.platform?.uuid) {
			await fin.Platform.wrapSync({ uuid }).quit();
		} else {
			await fin.Application.wrapSync({ uuid }).quit();
		}
	} catch {
		// Already gone.
	}
};

process.on("exit", quit);
process.on("SIGINT", async () => {
	await quit();
	process.exit(0);
});
fin.once("disconnected", () => process.exit(0));

await waitForCdp();
console.log(`CDP ready at http://127.0.0.1:${cdpPort}/json/list`);
console.log();
pollTargets();

if (duration > 0) {
	await sleep(duration * 1000);
	console.log();
	console.log(`Duration of ${duration}s elapsed, exiting.`);
	await quit();
	process.exit(0);
}
