import type { Context } from "@finos/fdc3";
import type { CellClickedEvent, ColDef, GridApi, IRowNode } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	dirClass,
	type FxRowWithPrev,
	fxPxFormatter,
	getPrice,
	type InstrumentCommentContext,
	type InstrumentContext,
	type InstrumentListContext,
	isoFormatter,
	numberFormatter,
	rows,
	rowToInstrument,
} from "./fx-helpers";
import { excelIcon, syncOffIcon, syncOnIcon, ticketIcon } from "./icons";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function FxPage() {
	const [rowData, setRowData] = useState<FxRowWithPrev[]>(
		rows.map((r) => ({ ...r, prevBid: r.bid, prevAsk: r.ask, prevMid: r.mid })),
	);
	const [isSyncEnabled, setIsSyncEnabled] = useState(false);
	const [isRiskOpen, setIsRiskOpen] = useState(false);
	const gridApiRef = useRef<GridApi<FxRowWithPrev> | null>(null);

	const buildContext = useCallback((): Context | null => {
		const api = gridApiRef.current;
		if (!api) return null;

		const instruments: InstrumentContext[] = [];
		api.forEachNode((node: IRowNode<FxRowWithPrev>) => {
			const ins = rowToInstrument(node);
			if (ins) instruments.push(ins);
		});

		if (instruments.length > 1) {
			const list: InstrumentListContext = { type: "fdc3.instrumentList", instruments };
			return list;
		}
		if (instruments.length === 1) {
			return instruments[0];
		}

		return null;
	}, []);

	const syncPrices = useCallback(async () => {
		try {
			const context = buildContext();
			if (!context) {
				console.warn("FDC3: No cell selection/focus to derive context from");
				return;
			}
			console.log("FDC3: broadcast", context);
			await window.fdc3?.broadcast(context);
		} catch (e) {
			console.error("Sync Cells failed", e);
		}
	}, [buildContext]);

	// Ticking price interval
	useEffect(() => {
		const interval = setInterval(() => {
			setRowData((prev) => prev.map((r) => getPrice(r)));

			if (isSyncEnabled) {
				syncPrices();
			}
		}, 2500);

		return () => clearInterval(interval);
	}, [syncPrices, isSyncEnabled]);

	const handleRiskClick = useCallback(async () => {
		try {
			const context: Context = { type: "Custom.LaunchWorkbook", id: { workbook: "risk-calculator" } };
			console.log("FDC3: broadcast", context);
			await window.fdc3?.broadcast(context);
			setTimeout(() => {
				setIsRiskOpen(true);
			}, 2000);
		} catch (e) {
			console.error("Launch workbook failed", e);
		}
	}, []);

	const handleNewWorkbook = useCallback(async () => {
		try {
			const context: Context = { type: "Custom.NewWorkbook" };
			console.log("FDC3: broadcast", context);
			await window.fdc3?.broadcast(context);
		} catch (e) {
			console.error("New workbook failed", e);
		}
	}, []);

	const handleSyncCells = useCallback(async () => {
		if (isSyncEnabled) {
			setIsSyncEnabled(false);
			return;
		}
		setIsSyncEnabled(true);
		await syncPrices();
	}, [isSyncEnabled, syncPrices]);

	const handleTradeTicket = useCallback(async () => {
		try {
			await window.fdc3?.raiseIntent("CreateOrder", {
				type: "fdc3.instrument",
				id: {
					ticker: "",
				},
			});
		} catch (e) {
			console.error("Trade ticket failed", e);
		}
	}, []);

	const handleCellClicked = useCallback(async (event: CellClickedEvent) => {
		try {
			const context = rowToInstrument(event.node) as Context;
			console.log("Raising intent", context);
			await window.fdc3?.raiseIntent("CreateOrder", context);
		} catch (e) {
			console.error("Trade ticket failed", e);
		}
	}, []);

	useEffect(() => {
		window.fdc3?.addContextListener(null, (ctx) => {
			if (ctx.type !== "here.instrumentComment") {
				return;
			}

			console.log("User Context Received: ", ctx);

			const c = ctx as InstrumentCommentContext;
			const comment: string | undefined = c.id?.comment ?? c.comment;
			const pair: string | undefined = c.id?.pair ?? c.pair;

			if (!pair || comment == null) {
				console.warn("FDC3: Context missing required fields 'pair' or 'comment'", ctx);
				return;
			}

			setRowData((prev) => {
				let changed = false;
				const next = prev.map((r) => {
					if (!changed && r.pair === pair) {
						changed = true;
						return { ...r, comment } as typeof r;
					}
					return r;
				});
				return next;
			});

			// Nicety: bring the updated row/comment cell into view and focus it if possible
			const api = gridApiRef.current;
			if (api) {
				let focused = false;
				api.forEachNode((node: IRowNode<FxRowWithPrev>) => {
					if (focused || !node.data) return;
					if (node.data.pair === pair && node.rowIndex != null) {
						api.ensureIndexVisible(node.rowIndex, "middle");
						api.setFocusedCell(node.rowIndex, "comment");
						focused = true;
					}
				});
			}
		});

		// The cleanup function must wait for the promise to resolve before unsubscribing.
		// return () => {
		//   listenerPromise?.then((listener) => {
		//     // listener?.unsubscribe?.();
		//   });
		// };
	}, []);

	const colDefs: ColDef<FxRowWithPrev>[] = useMemo(
		() => [
			{ headerName: "ID", field: "id", hide: true },
			{ headerName: "Pair", field: "pair", sortable: true, filter: true, width: 110 },
			{ headerName: "LP", field: "lp", sortable: true, filter: true, width: 110 },
			{
				headerName: "Bid",
				field: "bid",
				sortable: true,
				filter: "agNumberColumnFilter",
				width: 110,
				valueFormatter: fxPxFormatter,
				cellClass: (p) => [dirClass(p.value as number, p.data?.prevBid), "tradeable-cell-bid"],
				onCellClicked: handleCellClicked,
			},
			{
				headerName: "Ask",
				field: "ask",
				sortable: true,
				filter: "agNumberColumnFilter",
				width: 110,
				valueFormatter: fxPxFormatter,
				cellClass: (p) => [dirClass(p.value as number, p.data?.prevAsk), "tradeable-cell-ask"],
				onCellClicked: handleCellClicked,
			},
			{
				headerName: "Mid",
				field: "mid",
				sortable: true,
				filter: "agNumberColumnFilter",
				width: 110,
				valueFormatter: fxPxFormatter,
				cellClass: (p) => dirClass(p.value as number, p.data?.prevMid),
			},
			{
				headerName: "Spread (pips)",
				field: "spreadPips",
				sortable: true,
				filter: "agNumberColumnFilter",
				width: 80,
				valueFormatter: numberFormatter(1),
			},
			{
				headerName: "Timestamp (UTC)",
				field: "ts",
				sortable: true,
				filter: true,
				width: 190,
				valueFormatter: isoFormatter,
			},
			{
				headerName: "Volume (MM)",
				field: "volumeMM",
				sortable: true,
				filter: "agNumberColumnFilter",
				width: 80,
				valueFormatter: numberFormatter(0),
			},
			{ headerName: "Trader comment", field: "comment", sortable: true, filter: true, width: 200 },
		],
		[handleCellClicked],
	);

	const defaultColDef: ColDef<FxRowWithPrev> = useMemo(
		() => ({ resizable: true, minWidth: 80, suppressHeaderMenuButton: false }),
		[],
	);

	return (
		<div className="min-h-screen flex flex-col bg-white">
			<header className="h-14 flex items-center justify-between px-6 bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-lg border-b border-slate-700">
				<div className="flex items-center gap-4">
					<div className="w-1 h-8 bg-blue-500 rounded-full" />
					<h1 className="text-lg font-semibold tracking-wide">FX Trading</h1>
				</div>
				<div className="flex items-center gap-3">
					<div className="text-xs text-slate-300">
						{new Date().toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
						})}
					</div>
					<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-medium">
						AU
					</div>
				</div>
			</header>

			<main className="flex-1 p-4 pt-0">
				<div
					className="-mx-4 mb-3 flex items-center gap-1 px-4 py-2 bg-slate-100 border-y border-slate-200"
					role="toolbar"
					aria-label="FX Tools"
				>
					<button
						type="button"
						onClick={handleNewWorkbook}
						className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 hover:bg-slate-200"
					>
						{excelIcon}
						<span>New workbook</span>
					</button>
					<button
						type="button"
						onClick={handleTradeTicket}
						className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 hover:bg-slate-200"
					>
						{ticketIcon}
						<span>Trade ticket</span>
					</button>
					<div className="h-6 w-px bg-slate-300" />
					<button
						type="button"
						onClick={handleRiskClick}
						className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 hover:bg-slate-200"
					>
						{excelIcon}
						<span>Risk calculator</span>
					</button>
					<button
						type="button"
						onClick={handleSyncCells}
						className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
							!isRiskOpen
								? "opacity-50"
								: isSyncEnabled
									? "bg-blue-600 text-white hover:bg-blue-700"
									: "text-slate-700 hover:bg-slate-200"
						}`}
					>
						{isSyncEnabled ? syncOnIcon : syncOffIcon}
						<span>Sync prices</span>
					</button>
				</div>
				<div className="ag-theme-quartz w-full h-[70vh] rounded-md border">
					<AgGridReact
						theme={themeQuartz}
						rowData={rowData}
						columnDefs={colDefs}
						defaultColDef={defaultColDef}
						getRowId={(params) => params.data.id}
						rowHeight={34}
						headerHeight={36}
						animateRows
						suppressCellFocus={false}
						onGridReady={(e) => {
							gridApiRef.current = e.api;
						}}
					/>
				</div>
			</main>
		</div>
	);
}
