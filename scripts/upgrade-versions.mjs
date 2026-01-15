import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// =============================================================================
// Configuration
// =============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRAMEWORKS_DIR = path.resolve(__dirname, "../frameworks");
const ROOT_DIR = path.resolve(__dirname, "..");

const EXCLUDED_DIRECTORIES = new Set([
	"node_modules",
	".git",
	".angular",
	".venv",
	"dist",
	"build",
]);

const PACKAGES_TO_UPDATE = [
	"@openfin/core",
	"@openfin/workspace",
	"@openfin/workspace-platform",
	"@openfin/node-adapter",
	"@openfin/core-web",
	"@openfin/cloud-interop",
];

const VERSIONED_URL_EXTENSIONS = new Set([".html", ".json", ".ts", ".tsx", ".js", ".jsx", ".md"]);

const DEFAULT_VERSIONS = {
	major: "23.0.0",
	"github-url": "23.0.0",
	runtime: "43.142.101.1",
	core: "43.101.1",
	workspace: "23.0.16",
	"workspace-platform": "23.0.16",
	"core-web": "0.43.112",
	"cloud-interop": "0.43.112",
};

// =============================================================================
// File System Utilities
// =============================================================================

/**
 * Recursively walks a directory and collects files matching the given predicate.
 * @param {string} dir - Directory to start walking from
 * @param {(entry: import('fs').Dirent, fullPath: string) => boolean} filePredicate - Returns true for files to collect
 * @param {Set<string>} [excludedDirs] - Directory names to skip
 * @returns {Promise<string[]>} Array of matching file paths
 */
async function walkDirectory(dir, filePredicate, excludedDirs = EXCLUDED_DIRECTORIES) {
	const results = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			if (excludedDirs.has(entry.name)) continue;
			results.push(...(await walkDirectory(fullPath, filePredicate, excludedDirs)));
		} else if (filePredicate(entry, fullPath)) {
			results.push(fullPath);
		}
	}

	return results;
}

/**
 * Reads and parses a JSON file.
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<object>} Parsed JSON content
 */
async function readJsonFile(filePath) {
	const content = await fs.readFile(filePath, "utf-8");
	return JSON.parse(content);
}

/**
 * Writes an object to a JSON file with consistent formatting.
 * @param {string} filePath - Path to the JSON file
 * @param {object} data - Data to write
 */
async function writeJsonFile(filePath, data) {
	await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n");
}

/**
 * Checks if a file exists.
 * @param {string} filePath - Path to check
 * @returns {Promise<boolean>}
 */
async function fileExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

// =============================================================================
// File Finders
// =============================================================================

/**
 * Finds all npm projects (directories containing package.json).
 * @param {string} dir - Directory to search
 * @returns {Promise<string[]>} Array of project directory paths
 */
async function findProjects(dir) {
	const projects = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (!entry.isDirectory() || EXCLUDED_DIRECTORIES.has(entry.name)) continue;

		if (await fileExists(path.join(fullPath, "package.json"))) {
			projects.push(fullPath);
		} else {
			projects.push(...(await findProjects(fullPath)));
		}
	}

	return projects;
}

const findManifests = (dir) =>
	walkDirectory(dir, (entry) => entry.name === "manifest.fin.json");

const findMarkdownFiles = (dir) =>
	walkDirectory(dir, (entry) => entry.name.endsWith(".md"));

const findVersionedUrlFiles = (dir) =>
	walkDirectory(dir, (entry) => VERSIONED_URL_EXTENSIONS.has(path.extname(entry.name)));

// =============================================================================
// Version Update Functions
// =============================================================================

/**
 * Updates the version field in a package.json file.
 * @param {string} projectDir - Project directory path
 * @param {string} newVersion - New version string
 * @returns {Promise<boolean>} True if updated
 */
async function updatePackageJsonVersion(projectDir, newVersion) {
	const packageJsonPath = path.join(projectDir, "package.json");

	try {
		const pkg = await readJsonFile(packageJsonPath);

		if (pkg.version !== newVersion) {
			console.log(`  Updating package version from ${pkg.version} to ${newVersion}`);
			pkg.version = newVersion;
			await writeJsonFile(packageJsonPath, pkg);
			return true;
		}
	} catch (e) {
		console.error(`  Error updating package.json version in ${projectDir}: ${e.message}`);
	}

	return false;
}

/**
 * Updates package dependencies in a package.json file.
 * @param {string} projectDir - Project directory path
 * @param {Record<string, string>} versions - Package name to version mapping
 * @returns {Promise<boolean>} True if any dependencies were updated
 */
async function updatePackageJsonDependencies(projectDir, versions) {
	const packageJsonPath = path.join(projectDir, "package.json");
	const dependencyTypes = ["dependencies", "devDependencies", "peerDependencies"];

	try {
		const pkg = await readJsonFile(packageJsonPath);
		let modified = false;

		for (const depType of dependencyTypes) {
			if (!pkg[depType]) continue;

			for (const [pkgName, newVersion] of Object.entries(versions)) {
				if (pkg[depType][pkgName]) {
					console.log(`  Updating ${pkgName} to ${newVersion} in ${depType}`);
					pkg[depType][pkgName] = newVersion;
					modified = true;
				}
			}
		}

		if (modified) {
			await writeJsonFile(packageJsonPath, pkg);
			return true;
		}
	} catch (e) {
		console.error(`  Error updating package.json in ${projectDir}: ${e.message}`);
	}

	return false;
}

/**
 * Updates the runtime version in a manifest file.
 * @param {string} manifestPath - Path to manifest.fin.json
 * @param {string} newRuntimeVersion - New runtime version
 * @returns {Promise<string|null>} Old version if updated, null otherwise
 */
async function updateManifest(manifestPath, newRuntimeVersion) {
	try {
		const manifest = await readJsonFile(manifestPath);
		const oldVersion = manifest.runtime?.version;

		if (oldVersion && oldVersion !== newRuntimeVersion) {
			console.log(
				`  Updating runtime version from ${oldVersion} to ${newRuntimeVersion} in ${path.basename(manifestPath)}`,
			);
			manifest.runtime.version = newRuntimeVersion;
			await writeJsonFile(manifestPath, manifest);
			return oldVersion;
		}
	} catch (e) {
		console.error(`  Error updating manifest ${manifestPath}: ${e.message}`);
	}

	return null;
}

/**
 * Updates runtime version references in markdown files.
 * @param {string} projectDir - Project directory path
 * @param {string} oldVersion - Version to replace
 * @param {string} newVersion - New version
 */
async function updateMarkdownVersions(projectDir, oldVersion, newVersion) {
	if (!oldVersion || !newVersion || oldVersion === newVersion) return;

	const mdFiles = await findMarkdownFiles(projectDir);

	for (const file of mdFiles) {
		try {
			const content = await fs.readFile(file, "utf-8");

			if (content.includes(oldVersion)) {
				console.log(`  Updating runtime version in ${path.relative(projectDir, file)}`);
				await fs.writeFile(file, content.replaceAll(oldVersion, newVersion));
			}
		} catch (e) {
			console.error(`  Error updating markdown ${file}: ${e.message}`);
		}
	}
}

/**
 * Updates versioned URLs in files (e.g., built-on-openfin.github.io/.../v22.0.0/...).
 * @param {string} dir - Directory to search
 * @param {string} newMajorVersion - New major version for URLs
 * @returns {Promise<number>} Number of files updated
 */
async function updateVersionedUrls(dir, newMajorVersion) {
	const files = await findVersionedUrlFiles(dir);
	const urlVersionPattern = /(built-on-openfin\.github\.io\/[^/]+\/[^/]+\/)v\d+\.\d+\.\d+\//g;
	let updatedCount = 0;

	for (const file of files) {
		try {
			const content = await fs.readFile(file, "utf-8");
			const newContent = content.replace(urlVersionPattern, `$1v${newMajorVersion}/`);

			if (content !== newContent) {
				console.log(`  Updating versioned URLs in ${path.relative(dir, file)}`);
				await fs.writeFile(file, newContent);
				updatedCount++;
			}
		} catch (e) {
			console.error(`  Error updating versioned URLs in ${file}: ${e.message}`);
		}
	}

	return updatedCount;
}

// =============================================================================
// Command Execution
// =============================================================================

/**
 * Runs a shell command in the specified directory.
 * @param {string} command - Command to run
 * @param {string} cwd - Working directory
 * @returns {Promise<boolean>} True if command succeeded
 */
async function runCommand(command, cwd) {
	try {
		console.log(`  Running: ${command}`);
		execSync(command, { cwd, stdio: "inherit" });
		return true;
	} catch {
		console.error(`  Failed: ${command}`);
		return false;
	}
}

// =============================================================================
// Argument Parsing
// =============================================================================

/**
 * Parses command line arguments and returns configuration.
 * @returns {{ versions: Record<string, string>, runtimeVersion: string|null, installOnly: boolean, buildOnly: boolean }}
 */
function parseArguments() {
	const args = process.argv.slice(2);
	const versions = {};
	let runtimeVersion = null;
	let installOnly = false;
	let buildOnly = false;

	const updateVersion = (key, value) => {
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
			const pkgName = PACKAGES_TO_UPDATE.find((p) => p.endsWith(key)) || key;
			versions[pkgName] = value;
		} else {
			versions[key] = value;
		}
	};

	// Apply defaults
	for (const [key, value] of Object.entries(DEFAULT_VERSIONS)) {
		updateVersion(key, value);
	}

	// Parse CLI arguments
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (!arg.startsWith("--")) continue;

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

	return { versions, runtimeVersion, installOnly, buildOnly };
}

/**
 * Prints usage information and exits.
 */
function printUsageAndExit() {
	console.log(
		"Usage: node upgrade-openfin.mjs --runtime <version> --workspace <version> --core <version> ...",
	);
	console.log(
		"Supported flags: --runtime, --core, --workspace, --workspace-platform, --node-adapter, --core-web, --cloud-interop",
	);
	console.log("Options: --install-only (skip build), --build-only (skip install)");
	process.exit(1);
}

// =============================================================================
// Project Processing
// =============================================================================

/**
 * Processes a single project: updates dependencies, installs, and builds.
 * @param {string} projectDir - Project directory path
 * @param {object} options - Processing options
 * @returns {Promise<boolean>} True if all operations succeeded
 */
async function processProject(projectDir, { versions, majorVersion, installOnly, buildOnly }) {
	// Update package.json version
	await updatePackageJsonVersion(projectDir, majorVersion);

	// Update package.json dependencies
	if (Object.keys(versions).length > 0) {
		await updatePackageJsonDependencies(projectDir, versions);
	}

	// npm install (skip if build-only)
	if (!buildOnly) {
		if (!(await runCommand("npm install", projectDir))) {
			return false;
		}
		await runCommand("npm audit fix", projectDir);
	}

	// npm run build (skip if install-only)
	if (!installOnly) {
		if (!(await runCommand("npm run build", projectDir))) {
			return false;
		}
	}

	return true;
}

// =============================================================================
// Main
// =============================================================================

async function main() {
	const { versions, runtimeVersion, installOnly, buildOnly } = parseArguments();

	if (Object.keys(versions).length === 0 && !runtimeVersion) {
		printUsageAndExit();
	}

	const majorVersion = DEFAULT_VERSIONS.major;
	const githubUrlVersion = DEFAULT_VERSIONS["github-url"];

	// 1. Update root package.json version
	console.log("Updating root package.json version...");
	await updatePackageJsonVersion(ROOT_DIR, majorVersion);

	// 2. Update versioned URLs in the codebase
	console.log("\nUpdating versioned URLs in codebase...");
	const urlUpdatedCount = await updateVersionedUrls(FRAMEWORKS_DIR, githubUrlVersion);
	console.log(`Updated versioned URLs in ${urlUpdatedCount} file(s).`);

	// 3. Update all manifests across the frameworks directory
	if (runtimeVersion) {
		console.log("\nSearching for manifests in:", FRAMEWORKS_DIR);
		const allManifests = await findManifests(FRAMEWORKS_DIR);
		console.log(`Found ${allManifests.length} manifest(s).`);

		for (const manifestPath of allManifests) {
			const oldVersion = await updateManifest(manifestPath, runtimeVersion);
			if (oldVersion) {
				await updateMarkdownVersions(path.dirname(manifestPath), oldVersion, runtimeVersion);
			}
		}
	}

	// 4. Find and process npm projects
	console.log("\nSearching for projects in:", FRAMEWORKS_DIR);
	const projects = await findProjects(FRAMEWORKS_DIR);
	console.log(`Found ${projects.length} projects.`);

	const results = [];

	for (const projectDir of projects) {
		const projectName = path.basename(projectDir);
		console.log(`\nProcessing ${projectName} (${path.relative(FRAMEWORKS_DIR, projectDir)})...`);

		const success = await processProject(projectDir, {
			versions,
			majorVersion,
			installOnly,
			buildOnly,
		});

		results.push({ project: projectName, path: projectDir, success });
	}

	// 5. Print summary
	console.log("\n--- Summary ---");
	const failures = results.filter((r) => !r.success);

	if (failures.length > 0) {
		console.log("The following projects failed:");
		for (const f of failures) {
			console.log(`- ${f.project} (${f.path})`);
		}
		process.exit(1);
	} else {
		console.log("All projects updated and built successfully!");
	}
}

main().catch((err) => {
	console.error("Unexpected error:", err);
	process.exit(1);
});