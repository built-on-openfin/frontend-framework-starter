import type { Context } from "@finos/fdc3";
import type OpenFin from "@openfin/core";
import type { ExcelAssetSettings } from "./shapes";

/**
 * Interface for the search agent configuration data.
 */
export interface PriceLikeContext {
	bid?: string | number | null;
	ask?: string | number | null;
	[key: string]: unknown;
}

export type FxPriceContext = OpenFin.Context & {
	instruments: Context[];
};

export const fields = {
	pair: "A",
	lp: "B",
	bid: "C",
	ask: "D",
	calc: "E",
	comment: "F",
	id: "G",
};

export const excelAssetInfo: OpenFin.AppAssetInfo = {
	alias: "fx-rates.xlsx",
	version: "0.0.6",
	src: `${window.location.origin}/excel/fx-rates.zip`,
	target: "fx-rates.xlsx",
};

export const excelAssetSettings: ExcelAssetSettings = {
	title: "Excel Interop Example",
	description: "Excel Interop Example",
	workbook: "fx-rates.xlsx",
	worksheets: [
		{
			name: "risk",
			watchCells: [
				{
					cellRange: `$${fields.comment}$2:$${fields.comment}$15`,
					contextTypes: ["fdc3.instrument"],
					contextGroup: "green",
				},
			],
			identityCells: [
				{
					cellRange: `$${fields.id}$2:$${fields.id}$15`,
					idField: "id",
				},
			],
		},
	],
};
