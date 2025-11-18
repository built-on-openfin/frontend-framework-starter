import type { Context } from "@finos/fdc3";
import type OpenFin from "@openfin/core";
import type { Cell, ExcelWorksheet } from "@openfin/excel";
import {
	excelAssetInfo,
	excelAssetSettings,
	fields,
	type FxPriceContext,
	type PriceLikeContext,
} from "./config";
import {
	createWorkbook,
	getExcel,
	getWorksheetRef,
	launchAsset,
	listenToExcel,
	waitForWorksheet,
} from "./excel";
import type { ExcelAssetSettings, ExcelWorksheetSettings } from "./shapes";

/**
 * The interop clients for the different contexts.
 */
let interopClient: OpenFin.InteropClient | undefined;

export async function initInterop() {
	const contextClient = fin.Interop.connectSync(fin.me.identity.uuid, {});
	await contextClient.joinContextGroup("green");
	await contextClient.addContextHandler(handleContext);
	interopClient = contextClient;
}

/**
 * Handle fdc3 broadcasts from other applications
 * @param context The context being received.
 */
export async function handleContext(context: OpenFin.Context): Promise<void> {
	console.log("handleContext", context);

	const excelInstance = await getExcel();
	if (excelInstance) {
		if (context?.type === "Custom.NewWorkbook") {
			await createWorkbook();
			return;
		}

		if (context?.type === "Custom.LaunchWorkbook") {
			if (await launchAsset(excelAssetInfo)) {
				await listenToExcel(excelAssetSettings, handleCellChanges);
			}
			return;
		}

		if (context?.type === "fdc3.instrument") {
			await mapContextToCells(context, excelAssetSettings);
			return;
		}

		if (context?.type === "fdc3.instrumentList") {
			for (const instrument of (context as FxPriceContext).instruments) {
				await mapContextToCells(instrument, excelAssetSettings);
			}
			return;
		}
	} else {
		console.error("Excel integration could not be started in this environment");
	}
}

/**
 * Watch cell changes and broadcast context
 * @param excelAsset The asset to use for processing the cell changes.
 * @param worksheet The asset to use for processing the cell changes.
 * @param cells The cells that have changed.
 */
async function handleCellChanges(
	excelAsset: ExcelAssetSettings,
	worksheet: ExcelWorksheetSettings,
	cells: Cell[],
): Promise<void> {
	if (interopClient && worksheet.watchCells) {
		for (const cell of cells) {
			const cellHandler = worksheet.watchCells[0];
			if (cellHandler) {
				const client = interopClient;
				if (
					client &&
					(cellHandler.contextTypes.includes("instrument") ||
						cellHandler.contextTypes.includes("fdc3.instrument"))
				) {
					let ws: ExcelWorksheet | undefined = getWorksheetRef(
						excelAsset.workbook,
						excelAsset.worksheets[0].name,
					);
					if (!ws) {
						ws = await waitForWorksheet(excelAsset.workbook, excelAsset.worksheets[0].name);
					}
					if (!ws) {
						continue;
					}
					const range = cell.address.replace(fields.comment, fields.pair);
					const cellRange = await ws.getCellRange(range);
					const cellsInRange = await cellRange.getCells();
					if (cellsInRange.length) {
						await client.setContext({
							type: "here.instrumentComment",
							id: {
								pair: cellsInRange[0].value,
								comment: cell.value,
								_source: `excel.${excelAsset.workbook}.${worksheet.name}.${cell.address}`,
							},
						});
					}
				}
			}
		}
	}
}

/**
 * Maps the provided context data to specific cells in an Excel worksheet
 */
async function mapContextToCells(context: Context, assetSettings: ExcelAssetSettings): Promise<void> {
	try {
		if (!context) return;

		let worksheet: ExcelWorksheet | undefined = getWorksheetRef(
			assetSettings.workbook,
			assetSettings.worksheets[0].name,
		);
		if (!worksheet) {
			worksheet = await waitForWorksheet(assetSettings.workbook, assetSettings.worksheets[0].name);
		}

		if (!worksheet) return;

		const idField = assetSettings.worksheets[0]?.identityCells?.[0]?.idField;
		const idRangeAddress = assetSettings.worksheets[0]?.identityCells?.[0]?.cellRange;
		if (!idField || !idRangeAddress) return;

		const cellRange = await worksheet.getCellRange(idRangeAddress);
		const idValue = context.id?.[idField];
		const id = typeof idValue === "string" ? idValue : idValue != null ? String(idValue) : undefined;

		if (id == null) return;

		const cells = await cellRange.getCells();

		for (const cell of cells) {
			if (cell.value === id) {
				const startRange = cell.address.replace(fields.id, fields.bid);
				const endRange = cell.address.replace(fields.id, fields.ask);
				const priceCells = `${startRange}:${endRange}`;
				const priceRange = await worksheet.getCellRange(priceCells);
				const priceLike = context as PriceLikeContext;
				await priceRange.setValues([[priceLike.bid ?? "", priceLike.ask ?? ""]]);
			}
		}
	} catch (e) {
		console.error(e);
	}
}

/**
 * Do any cleanup that is required.
 */
export async function closeDown(): Promise<void> {
	await interopClient?.removeFromContextGroup();
}
