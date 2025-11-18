import type OpenFin from "@openfin/core";
import type { Cell, ExcelApplication, ExcelWorkbook, ExcelWorksheet } from "@openfin/excel";
import * as excelConnector from "@openfin/excel";
import { fields } from "./config";
import type { ExcelAssetSettings, ExcelWorksheetSettings } from "./shapes";

let excel: ExcelApplication | undefined;

// Caches and state for workbook/worksheet discovery
const workbookCache = new Map<string, ExcelWorkbook>();
const worksheetCache = new Map<string, ExcelWorksheet>();
const pendingWorksheetPromises = new Map<string, Promise<ExcelWorksheet | undefined>>();
const attachedChangeListeners = new Set<string>();
// Store per-worksheet change handlers so we can remove them later
const changeHandlerMap = new Map<string, (cells: Cell[]) => Promise<void>>();

function worksheetKey(workbookName: string, worksheetName: string): string {
	return `${workbookName}::${worksheetName}`;
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gets the configured app asset and ensures it is available.
 * @returns A boolean indicating if the app asset is available.
 */
async function getAppAsset(assetInfo: OpenFin.AppAssetInfo): Promise<boolean> {
	let availableAppAsset: OpenFin.AppAssetInfo | undefined;
	try {
		if (assetInfo !== undefined) {
			availableAppAsset = await fin.System.getAppAssetInfo({ alias: assetInfo.alias });
		}
	} catch (appAssetError) {
		console.debug(
			`App asset info for alias: ${assetInfo.alias} is not available. Response from getAppAssetInfo`,
			appAssetError,
		);
	}
	if (
		(availableAppAsset === undefined || assetInfo.version !== availableAppAsset.version) &&
		assetInfo !== undefined
	) {
		console.info(`App asset with alias: ${assetInfo.alias} does not exist in memory. Fetching it.`);
		try {
			await fin.System.downloadAsset(assetInfo, (progress) => {
				const downloadedPercent = Math.floor((progress.downloadedBytes / progress.totalBytes) * 100);
				console.info(
					`Downloaded ${downloadedPercent}% of app asset with alias of ${assetInfo.alias}`,
				);
			});
		} catch (error) {
			console.error(`Error trying to download app asset with alias: ${assetInfo.alias}`, error);
			return false;
		}
	}
	return true;
}

/**
 * Get the Excel application.
 * @param assetInfo
 * @returns boolean - false if asset not available, true if lanched
 */
export async function launchAsset(assetInfo: OpenFin.AppAssetInfo): Promise<boolean> {
	const assetAvailable = await getAppAsset(assetInfo);
	if (!assetAvailable) {
		return false;
	}
	await fin.System.launchExternalProcess({
		alias: assetInfo.alias,
	});
	return true;
}

/**
 * Get the excel application.
 * @returns The application.
 * @internal
 */
export async function getExcel(): Promise<ExcelApplication | undefined> {
	try {
		if (typeof window === "undefined") {
			return; // Only run in browser
		}

		excel = await excelConnector.getExcelApplication(true);
		return excel;
	} catch (err) {
		console.error("Error getting Excel application", err);
	}
}

/**
 * Wait for a workbook and worksheet to become available, with caching.
 * Subsequent calls for the same workbook/worksheet pair will reuse the cached reference
 * or the in-flight promise.
 */
export async function waitForWorksheet(
	workbookName: string,
	worksheetName: string,
	opts?: { maxAttempts?: number; intervalMs?: number },
): Promise<ExcelWorksheet | undefined> {
	const maxAttempts = opts?.maxAttempts ?? 10;
	const intervalMs = opts?.intervalMs ?? 1000;
	const key = worksheetKey(workbookName, worksheetName);

	// If we already have a cached worksheet, return it
	if (worksheetCache.has(key)) {
		return worksheetCache.get(key);
	}
	// If a lookup is already in progress, await it
	if (pendingWorksheetPromises.has(key)) {
		const inFlight = pendingWorksheetPromises.get(key);
		if (inFlight) {
			return await inFlight;
		}
		return undefined;
	}

	const promise = (async () => {
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				const wb = await getWorkbookByName(workbookName);

				wb?.addEventListener("close", () => {
					workbookCache.clear();
					worksheetCache.clear();
				});

				if (wb) {
					// cache workbook for quick access
					workbookCache.set(workbookName, wb);
					const ws = await wb.getWorksheetByName(worksheetName);
					if (ws) {
						worksheetCache.set(key, ws);
						return ws;
					}
				}
			} catch (_err) {
				// Swallow and retry until attempts exhausted
			}
			await delay(intervalMs);
		}
		console.error(
			`Excel worksheet not available after ${maxAttempts} attempts: ${workbookName}/${worksheetName}`,
		);
		return undefined;
	})();

	pendingWorksheetPromises.set(key, promise);
	try {
		const result = await promise;
		return result;
	} finally {
		pendingWorksheetPromises.delete(key);
	}
}

/**
 * Get a cached worksheet reference synchronously if available.
 */
export function getWorksheetRef(workbookName: string, worksheetName: string): ExcelWorksheet | undefined {
	const key = worksheetKey(workbookName, worksheetName);
	return worksheetCache.get(key);
}

/**
 * Creates a new workbook using the Excel application.
 * The method attempts to initialize the Excel application
 * and invokes the creation of a new workbook.
 */
export async function createWorkbook(): Promise<void> {
	console.log("Creating new workbook");
	try {
		const excelApp = await getExcel();
		await excelApp?.createWorkbook();
	} catch (e) {
		console.error("Error creating new workbook", e);
	}
}

/**
 * Listen for changes on configured worksheets. This relies on a reusable
 * `waitForWorksheet` helper that polls for the workbook/worksheet and caches the
 * reference so subsequent calls are instant and do not re-scan.
 *
 * The external API is unchanged.
 */
export async function listenToExcel(
	assetSettings: ExcelAssetSettings,
	handleCellChanges: (
		excelAsset: ExcelAssetSettings,
		worksheet: ExcelWorksheetSettings,
		cells: Cell[],
	) => Promise<void>,
): Promise<void> {
	try {
		const excelInstance = await getExcel();
		if (!excelInstance) {
			console.error("Excel application is not available in this environment.");
			return;
		}

		for (const worksheetSettings of assetSettings.worksheets) {
			const ws: ExcelWorksheet | undefined = await waitForWorksheet(
				assetSettings.workbook,
				worksheetSettings.name,
			);
			if (!ws) {
				continue;
			}

			const key = worksheetKey(assetSettings.workbook, worksheetSettings.name);

			// Build or reuse a stable handler bound to the current assetSettings + worksheetSettings + handleCellChanges
			let handler = changeHandlerMap.get(key);
			if (!handler) {
				handler = async (changedCells: Cell[]) => {
					// TODO: Only subscribe to ranges we care about
					const filtered = changedCells.filter((cell) =>
						cell.address.includes(`$${fields.comment}$`),
					);
					if (!filtered.length) return;
					await handleCellChanges(assetSettings, worksheetSettings, filtered);
				};
				changeHandlerMap.set(key, handler);
			}

			// await ws.removeEventListener("change", handler);
			await ws.addEventListener("change", handler);

			attachedChangeListeners.add(key);
		}
	} catch (e) {
		console.error(e);
	}
}

/**
 * Retrieves an Excel workbook by its name.
 * @param {string} name - The name of the workbook to retrieve.
 * @return {Promise<ExcelWorkbook | undefined>} A promise that resolves to the workbook if found, or undefined if not found.
 */
export async function getWorkbookByName(name: string): Promise<ExcelWorkbook | undefined> {
	const excelInstance = await getExcel();
	const workbooks = await excelInstance?.getWorkbooks();
	if (!workbooks) return undefined;
	for (const workbook of workbooks) {
		const workbookName = await workbook.getName();
		if (workbookName === name) {
			return workbook;
		}
	}
}
