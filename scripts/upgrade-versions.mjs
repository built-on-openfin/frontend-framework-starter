import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRAMEWORKS_DIR = path.resolve(__dirname, "../frameworks");
const ROOT_DIR = path.resolve(__dirname, "..");

const PACKAGES_TO_UPDATE = [
	"@openfin/core",
	"@openfin/workspace",
	"@openfin/workspace-platform",
	"@openfin/node-adapter",
	"@openfin/core-web",
	"@openfin/cloud-interop",
];

const DEFAULT_VERSIONS = {
	major: "23.0.0",
	runtime: "43.142.101.1",
	core: "43.101.1",
	workspace: "23.0.16",
	"workspace-platform": "23.0.16",
	"core-web": "0.43.112",
	"cloud-interop": "0.43.112",
};

// Parse arguments
const args = process.argv.slice(2);
const versions = {};
let runtimeVersion = null;
let installOnly = false;
let buildOnly = false;

function updateVersion(key, value) {
	if (key === "runtime") {
		runtimeVersion = value;
	} else if (["core", "@openfin/core", "node-adapter", "@openfin/node-adapter"].includes(key)) {
		versions["@openfin/core"] = value;
		versions["@openfin/node-adapter"] = value;
	} else if (
		["workspace", "@openfin/workspace", "workspace-platform", "@openfin/workspace-platform"].includes(key)
	) {
		versions["@openfin/workspace"] = value;
		versions["@openfin/workspace-platform"] = value;
	} else if (PACKAGES_TO_UPDATE.some((pkg) => pkg.endsWith(key))) {
		// map shorthand keys (e.g. "core" -> "@openfin/core") or full names
		const pkgName = PACKAGES_TO_UPDATE.find((p) => p.endsWith(key)) || key;
		versions[pkgName] = value;
	} else {
		// Allow passing full package name as key? e.g. --@openfin/core 1.2.3
		versions[key] = value;
	}
}

// Apply defaults
Object.entries(DEFAULT_VERSIONS).forEach(([key, value]) => updateVersion(key, value));

for (let i = 0; i < args.length; i++) {
	const arg = args[i];
	if (arg.startsWith("--")) {
		const key = arg.substring(2);
		if (key === "install-only") {
			installOnly = true;
		} else if (key === "build-only") {
			buildOnly = true;
		} else {
			const value = args[i + 1];
			if (value && !value.startsWith("--")) {
				updateVersion(key, value);
				i++;
			}
		}
	}
}

if (Object.keys(versions).length === 0 && !runtimeVersion) {
	console.log(
		"Usage: node upgrade-openfin.mjs --runtime <version> --workspace <version> --core <version> ...",
	);
	console.log(
		"Supported flags: --runtime, --core, --workspace, --workspace-platform, --node-adapter, --core-web, --cloud-interop",
	);
	console.log("Options: --install-only (skip build), --build-only (skip install)");
	process.exit(1);
}

async function findProjects(dir) {
	const projects = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (
				entry.name === "node_modules" ||
				entry.name === ".git" ||
				entry.name === ".angular" ||
				entry.name === ".venv"
			)
				continue;

			// Check if this directory is a project (has package.json)
			try {
				await fs.access(path.join(fullPath, "package.json"));
				projects.push(fullPath);
			} catch (e) {
				// Not a project, recurse
				const subProjects = await findProjects(fullPath);
				projects.push(...subProjects);
			}
		}
	}
	return projects;
}

async function updatePackageJsonVersion(projectDir, newVersion) {
	const packageJsonPath = path.join(projectDir, "package.json");
	try {
		const content = await fs.readFile(packageJsonPath, "utf-8");
		let pkg = JSON.parse(content);

		if (pkg.version !== newVersion) {
			console.log(`  Updating package version from ${pkg.version} to ${newVersion}`);
			pkg.version = newVersion;
			await fs.writeFile(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
			return true;
		}
	} catch (e) {
		console.error(`  Error updating package.json version in ${projectDir}: ${e.message}`);
	}
	return false;
}

async function updatePackageJson(projectDir, versions) {
	const packageJsonPath = path.join(projectDir, "package.json");
	try {
		const content = await fs.readFile(packageJsonPath, "utf-8");
		let pkg = JSON.parse(content);
		let modified = false;

		["dependencies", "devDependencies", "peerDependencies"].forEach((depType) => {
			if (!pkg[depType]) return;
			for (const [pkgName, newVersion] of Object.entries(versions)) {
				if (pkg[depType][pkgName]) {
					console.log(`  Updating ${pkgName} to ${newVersion} in ${depType}`);
					pkg[depType][pkgName] = newVersion;
					modified = true;
				}
			}
		});

		if (modified) {
			await fs.writeFile(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
			return true;
		}
	} catch (e) {
		console.error(`  Error updating package.json in ${projectDir}: ${e.message}`);
	}
	return false;
}

async function findManifests(dir, manifests = []) {
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (
				entry.name === "node_modules" ||
				entry.name === ".git" ||
				entry.name === ".venv" ||
				entry.name === "dist" ||
				entry.name === "build"
			)
				continue;
			await findManifests(fullPath, manifests);
		} else if (entry.name === "manifest.fin.json") {
			manifests.push(fullPath);
		}
	}
	return manifests;
}

async function updateManifest(manifestPath, newRuntimeVersion) {
	try {
		const content = await fs.readFile(manifestPath, "utf-8");
		const manifest = JSON.parse(content);

		let oldVersion = null;
		if (manifest.runtime && manifest.runtime.version) {
			oldVersion = manifest.runtime.version;
			if (oldVersion !== newRuntimeVersion) {
				console.log(
					`  Updating runtime version from ${oldVersion} to ${newRuntimeVersion} in ${path.basename(manifestPath)}`,
				);
				manifest.runtime.version = newRuntimeVersion;
				await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
				return oldVersion;
			}
		}
		return null; // No update needed or runtime not found
	} catch (e) {
		console.error(`  Error updating manifest ${manifestPath}: ${e.message}`);
		return null;
	}
}

async function findMarkdownFiles(dir) {
	let results = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (
				entry.name === "node_modules" ||
				entry.name === ".git" ||
				entry.name === ".venv" ||
				entry.name === "dist" ||
				entry.name === "build"
			)
				continue;
			results = results.concat(await findMarkdownFiles(fullPath));
		} else if (entry.name.endsWith(".md")) {
			results.push(fullPath);
		}
	}
	return results;
}

async function updateMarkdown(projectDir, oldVersion, newVersion) {
	if (!oldVersion || !newVersion || oldVersion === newVersion) return;

	const mdFiles = await findMarkdownFiles(projectDir);
	for (const file of mdFiles) {
		try {
			const content = await fs.readFile(file, "utf-8");
			if (content.includes(oldVersion)) {
				console.log(`  Updating runtime version in ${path.relative(projectDir, file)}`);
				const newContent = content.replaceAll(oldVersion, newVersion);
				await fs.writeFile(file, newContent);
			}
		} catch (e) {
			console.error(`  Error updating markdown ${file}: ${e.message}`);
		}
	}
}

async function runCommand(command, cwd) {
	try {
		console.log(`  Running: ${command}`);
		execSync(command, { cwd, stdio: "inherit" }); // Inherit to show output and errors
		return true;
	} catch (e) {
		console.error(`  Failed: ${command}`);
		return false;
	}
}

async function main() {
	const majorVersion = DEFAULT_VERSIONS.major;

	// 1. Update root package.json version
	console.log("Updating root package.json version...");
	await updatePackageJsonVersion(ROOT_DIR, majorVersion);

	// 2. Update all manifests across the entire frameworks directory
	if (runtimeVersion) {
		console.log("\nSearching for manifests in:", FRAMEWORKS_DIR);
		const allManifests = await findManifests(FRAMEWORKS_DIR);
		console.log(`Found ${allManifests.length} manifest(s).`);

		for (const manifestPath of allManifests) {
			const oldVersion = await updateManifest(manifestPath, runtimeVersion);
			if (oldVersion) {
				const manifestDir = path.dirname(manifestPath);
				await updateMarkdown(manifestDir, oldVersion, runtimeVersion);
			}
		}
	}

	// 3. Find and process npm projects
	console.log("\nSearching for projects in:", FRAMEWORKS_DIR);
	const projects = await findProjects(FRAMEWORKS_DIR);
	console.log(`Found ${projects.length} projects.`);

	const results = [];

	for (const projectDir of projects) {
		const projectName = path.basename(projectDir);
		console.log(`\nProcessing ${projectName} (${path.relative(FRAMEWORKS_DIR, projectDir)})...`);

		let failed = false;

		// Update package.json version
		await updatePackageJsonVersion(projectDir, majorVersion);

		// Update package.json dependencies
		if (Object.keys(versions).length > 0) {
			await updatePackageJson(projectDir, versions);
		}

		// npm install (skip if build-only)
		if (!buildOnly) {
			if (!(await runCommand("npm install", projectDir))) {
				failed = true;
			}

			// npm audit fix
			if (!failed) {
				await runCommand("npm audit fix", projectDir);
			}
		}

		// npm run build (skip if install-only)
		if (!failed && !installOnly) {
			if (!(await runCommand("npm run build", projectDir))) {
				failed = true;
			}
		}

		results.push({ project: projectName, path: projectDir, success: !failed });
	}

	console.log("\n--- Summary ---");
	const failures = results.filter((r) => !r.success);
	if (failures.length > 0) {
		console.log("The following projects failed:");
		failures.forEach((f) => console.log(`- ${f.project} (${f.path})`));
		process.exit(1);
	} else {
		console.log("All projects updated and built successfully!");
	}
}

main().catch((err) => {
	console.error("Unexpected error:", err);
	process.exit(1);
});
