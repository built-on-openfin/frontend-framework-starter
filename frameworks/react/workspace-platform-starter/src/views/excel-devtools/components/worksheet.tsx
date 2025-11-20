import { type Cell, type CellValue, type DataStream, type ExcelFilterOperator } from "@openfin/excel";
import * as React from "react";
import {
	FaBell,
	FaCalculator,
	FaEdit,
	FaFilter,
	FaFont,
	FaPlay,
	FaShieldAlt,
	FaStop,
	FaStream,
	FaTable,
	FaTrash,
} from "react-icons/fa";
import { type WorksheetProps } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Accordion } from "./ui/accordion";

let dataStream: DataStream | undefined;

export function Worksheet({
	excelApplication,
	selectedWorkbookId,
	setOutput,
	setErrorOutput,
	addRegisteredEvent,
	addMessageToEventLog,
	getNewRegisteredEventId,
}: WorksheetProps) {
	const [worksheetId, setWorksheetId] = React.useState("");
	const [worksheetName, setWorksheetName] = React.useState("");
	const [cellRange, setCellRange] = React.useState("");
	const [cellName, setCellName] = React.useState("");
	const [valuesMap, setValuesMap] = React.useState("");
	const [cellFormatting, setCellFormatting] = React.useState("");
	const [filterField, setFilterField] = React.useState("");
	const [filterOp, setFilterOp] = React.useState("");
	const [filterCriteria1, setFilterCriteria1] = React.useState("");
	const [filterCriteria2, setFilterCriteria2] = React.useState("");
	const [filterVisibleDropDown, setFilterVisibleDropDown] = React.useState("");
	const [streamingApiEndpoint, setStreamingApiEndpoint] = React.useState(
		"http://numbersapi.com/random/math?json",
	);
	const [streamingDataAddress, setStreamingDataAddress] = React.useState("number");
	const [streamingUpdateInterval, setStreamingUpdateInterval] = React.useState("");
	const [isStreaming, setIsStreaming] = React.useState<boolean>(false);

	const disabled = !excelApplication;

	// Basic Operations
	const handleActivate = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.activate();
			setOutput("Worksheet activated");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleCalculate = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.calculate();
			setOutput("Calculation complete");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleDelete = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.delete();
			setOutput("Worksheet deleted");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetWorksheet = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			setOutput(worksheet);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetName = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const name = await worksheet.getName();
			setOutput(name);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleSetName = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.setName(worksheetName);
			setOutput("Worksheet name updated");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleProtect = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.protect();
			setOutput("Worksheet protected");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleClearAll = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.clearAllCells();
			setOutput("All cells cleared");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleClearAllValues = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.clearAllCellValues();
			setOutput("All cell values cleared");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleClearAllFormatting = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.clearAllCellFormatting();
			setOutput("All cell formatting cleared");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	// Cell Range Operations
	const handleGetCellRange = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			setOutput(range);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetCells = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			const cells = await range.getCells();
			setOutput(cells);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetCellsNames = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			const names = await range.getNames();
			setOutput(names);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleSetCellValues = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			await range.setValues(JSON.parse(valuesMap));
			setOutput("Cell values updated");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleClearCells = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			await range.clear();
			setOutput("Cells cleared");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleClearCellValues = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			await range.clearValues();
			setOutput("Cell values cleared");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleClearCellFormatting = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			await range.clearFormatting();
			setOutput("Cell formatting cleared");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	// Cell Name Operations
	const handleSetCellName = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			await range.setName(cellName);
			setOutput("Cell name set");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	// Cell Formatting Operations
	const handleSetCellFormatting = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			const formatting = JSON.parse(cellFormatting);
			await range.setFormatting(formatting);
			setOutput("Cell formatting applied");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const setFormattingPreset = (preset: string) => {
		setCellFormatting(preset);
	};

	// Filtering Operations
	const handleSetFilter = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			const columnIndex = parseInt(filterField, 10);
			const visibleDropDown: boolean = filterVisibleDropDown
				? JSON.parse(filterVisibleDropDown)
				: undefined;
			await range.setFilter(
				columnIndex,
				filterOp as ExcelFilterOperator,
				filterCriteria1,
				filterCriteria2,
				visibleDropDown,
			);
			setOutput("Filter applied");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	// Streaming Operations
	const handleStartStreaming = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			const updateInterval = streamingUpdateInterval ? parseFloat(streamingUpdateInterval) : undefined;
			dataStream = range.createDataStream(async (): Promise<CellValue> => {
				try {
					const response = await fetch(streamingApiEndpoint, {
						headers: { Accept: "application/json" },
						method: "GET",
					});
					const payload = await response.json();
					// eslint-disable-next-line no-eval
					return eval(`payload.${streamingDataAddress}`) as CellValue;
				} catch (err) {
					setErrorOutput(err);
					throw err;
				}
			}, updateInterval);
			dataStream.start();
			setIsStreaming(true);
			setOutput(`Started streaming from ${streamingApiEndpoint}`);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleStopStreaming = () => {
		try {
			dataStream?.close();
			setIsStreaming(false);
			setOutput("Stopped streaming");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	// Legacy Operations
	const handleLegacyGetCells = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const cells = await worksheet.getCells(cellRange);
			setOutput(cells);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleLegacySetCellValues = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.setCellValues(cellRange, JSON.parse(valuesMap));
			setOutput("Cell values updated (legacy)");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleLegacyClearCells = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.clearCells(cellRange);
			setOutput("Cells cleared (legacy)");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleLegacyClearCellValues = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.clearCellValues(cellRange);
			setOutput("Cell values cleared (legacy)");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleLegacyClearCellFormatting = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.clearCellFormatting(cellRange);
			setOutput("Cell formatting cleared (legacy)");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleLegacySetCellName = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			await worksheet.setCellName(cellRange, cellName);
			setOutput("Cell name set (legacy)");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleLegacySetCellFormatting = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const formatting = JSON.parse(cellFormatting);
			await worksheet.setCellFormatting(cellRange, formatting);
			setOutput("Cell formatting applied (legacy)");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleLegacyFilterCells = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const columnIndex = parseInt(filterField, 10);
			const visibleDropDown: boolean = filterVisibleDropDown
				? JSON.parse(filterVisibleDropDown)
				: undefined;
			await worksheet.filterCells(
				cellRange,
				columnIndex,
				filterOp as ExcelFilterOperator,
				filterCriteria1,
				filterCriteria2,
				visibleDropDown,
			);
			setOutput("Filter applied (legacy)");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleLegacyStartStreaming = async () => {
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const updateInterval = streamingUpdateInterval ? parseFloat(streamingUpdateInterval) : undefined;
			dataStream = worksheet.createDataStream(
				cellRange,
				async (): Promise<CellValue> => {
					try {
						const response = await fetch(streamingApiEndpoint, {
							headers: { Accept: "application/json" },
							method: "GET",
						});
						const payload = await response.json();
						// eslint-disable-next-line no-eval
						return eval(`payload.${streamingDataAddress}`) as CellValue;
					} catch (err) {
						setErrorOutput(err);
						throw err;
					}
				},
				updateInterval,
			);
			dataStream.start();
			setIsStreaming(true);
			setOutput(`Started streaming from ${streamingApiEndpoint} (legacy)`);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	// Event Handlers
	const registerWorksheetEvent = async (eventName: string, handler?: (...args: any[]) => string) => {
		const id = getNewRegisteredEventId();
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const title = `worksheet:${worksheet.objectId}:${eventName}`;
			const listener = (...args: any[]) => {
				let message = `${id}; ${title}`;
				if (handler) {
					message += `; ${handler(...args)}`;
				}
				addMessageToEventLog(message);
			};
			const registeredEvent = {
				deregister: () => {
					worksheet.removeEventListener(listener);
				},
				title,
				id,
			};
			await worksheet.addEventListener(eventName, listener);
			addRegisteredEvent(registeredEvent);
			setOutput(`Registered event ${title} (${id})`);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const registerCellRangeEvent = async (eventName: string, handler?: (...args: any[]) => string) => {
		const id = getNewRegisteredEventId();
		try {
			const worksheet = await excelApplication!.getWorksheetById(worksheetId);
			const range = await worksheet.getCellRange(cellRange);
			const title = `cellRange:${range.address}:${worksheet.objectId}:${eventName}`;
			const listener = (...args: any[]) => {
				let message = `${id}; ${title}`;
				if (handler) {
					message += `; ${handler(...args)}`;
				}
				addMessageToEventLog(message);
			};
			const registeredEvent = {
				deregister: () => {
					range.removeEventListener(listener);
				},
				title,
				id,
			};
			await range.addEventListener(eventName, listener);
			addRegisteredEvent(registeredEvent);
			setOutput(`Registered cell range event ${title} (${id})`);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-gray-900">Worksheet Operations</h2>
				<p className="mt-1 text-sm text-gray-600">
					Operate on a specific worksheet by ID or name; use the controls below for ranges, cells,
					filters and events.
				</p>
			</div>

			<div className="bg-white border border-gray-200 rounded-lg p-4">
				<Input
					label="Worksheet ID"
					placeholder="e.g. Sheet1"
					value={worksheetId}
					onChange={(e) => setWorksheetId(e.target.value)}
					helperText="Enter the ID of the worksheet to operate on"
				/>
			</div>

			<Accordion defaultOpen={["basic"]}>
				{/* Basic Operations */}
				<Accordion.Item value="basic">
					<Accordion.Trigger value="basic" icon={<FaTable />}>
						Basic Operations
					</Accordion.Trigger>
					<Accordion.Content value="basic">
						<div className="space-y-4">
							<div className="flex flex-wrap gap-2">
								<Button
									variant="primary"
									onClick={handleActivate}
									disabled={disabled || !worksheetId}
									icon={<FaPlay />}
								>
									Activate
								</Button>
								<Button
									variant="secondary"
									onClick={handleCalculate}
									disabled={disabled || !worksheetId}
									icon={<FaCalculator />}
								>
									Calculate
								</Button>
								<Button
									variant="secondary"
									onClick={handleGetWorksheet}
									disabled={disabled || !worksheetId}
								>
									Get Worksheet
								</Button>
								<Button
									variant="secondary"
									onClick={handleGetName}
									disabled={disabled || !worksheetId}
								>
									Get Name
								</Button>
								<Button
									variant="secondary"
									onClick={handleProtect}
									disabled={disabled || !worksheetId}
									icon={<FaShieldAlt />}
								>
									Protect
								</Button>
								<Button
									variant="destructive"
									onClick={handleDelete}
									disabled={disabled || !worksheetId}
									icon={<FaTrash />}
								>
									Delete
								</Button>
							</div>

							<div className="border-t border-gray-200 pt-4 space-y-4">
								<h3 className="text-sm font-medium text-gray-900">Clear Operations</h3>
								<div className="flex flex-wrap gap-2">
									<Button
										variant="outline"
										onClick={handleClearAll}
										disabled={disabled || !worksheetId}
									>
										Clear All Cells
									</Button>
									<Button
										variant="outline"
										onClick={handleClearAllValues}
										disabled={disabled || !worksheetId}
									>
										Clear All Values
									</Button>
									<Button
										variant="outline"
										onClick={handleClearAllFormatting}
										disabled={disabled || !worksheetId}
									>
										Clear All Formatting
									</Button>
								</div>
							</div>

							<div className="border-t border-gray-200 pt-4 space-y-2">
								<Input
									label="Worksheet Name"
									placeholder="e.g. MySheet"
									value={worksheetName}
									onChange={(e) => setWorksheetName(e.target.value)}
								/>
								<Button
									variant="secondary"
									onClick={handleSetName}
									disabled={disabled || !worksheetId || !worksheetName}
									icon={<FaEdit />}
								>
									Set Worksheet Name
								</Button>
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Cell Ranges */}
				<Accordion.Item value="ranges">
					<Accordion.Trigger value="ranges" icon={<FaTable />}>
						Cell Ranges
					</Accordion.Trigger>
					<Accordion.Content value="ranges">
						<div className="space-y-4">
							<Input
								label="Cell Range"
								placeholder="e.g. A1, B2:C3, cell name, etc"
								value={cellRange}
								onChange={(e) => setCellRange(e.target.value)}
							/>

							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-medium text-gray-900 mb-2">
										Range Operations
									</h3>
									<div className="flex flex-wrap gap-2">
										<Button
											variant="secondary"
											size="sm"
											onClick={handleGetCellRange}
											disabled={disabled || !worksheetId || !cellRange}
										>
											Get Cell Range
										</Button>
										<Button
											variant="secondary"
											size="sm"
											onClick={handleGetCells}
											disabled={disabled || !worksheetId || !cellRange}
										>
											Get Cells
										</Button>
										<Button
											variant="secondary"
											size="sm"
											onClick={handleGetCellsNames}
											disabled={disabled || !worksheetId || !cellRange}
										>
											Get Names
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleClearCells}
											disabled={disabled || !worksheetId || !cellRange}
										>
											Clear
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleClearCellValues}
											disabled={disabled || !worksheetId || !cellRange}
										>
											Clear Values
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleClearCellFormatting}
											disabled={disabled || !worksheetId || !cellRange}
										>
											Clear Formatting
										</Button>
									</div>
								</div>

								<div className="border-t border-gray-200 pt-4">
									<h3 className="text-sm font-medium text-gray-900 mb-2">Set Cell Name</h3>
									<div className="space-y-2">
										<Input
											label="Cell Name"
											placeholder="e.g. MyCell"
											value={cellName}
											onChange={(e) => setCellName(e.target.value)}
										/>
										<Button
											variant="secondary"
											onClick={handleSetCellName}
											disabled={disabled || !worksheetId || !cellRange || !cellName}
										>
											Set Name
										</Button>
									</div>
								</div>

								<div className="border-t border-gray-200 pt-4">
									<h3 className="text-sm font-medium text-gray-900 mb-2">
										Set Cell Values
									</h3>
									<div className="space-y-2">
										<Input
											label="Values Map"
											placeholder='e.g. [["3", "A"], ["2", "B"], ["1", "C"]]'
											value={valuesMap}
											onChange={(e) => setValuesMap(e.target.value)}
										/>
										<Button
											variant="secondary"
											onClick={handleSetCellValues}
											disabled={disabled || !worksheetId || !cellRange || !valuesMap}
										>
											Set Values
										</Button>
									</div>
								</div>

								<div className="border-t border-gray-200 pt-4">
									<h3 className="text-sm font-medium text-gray-900 mb-2">
										Cell Formatting
									</h3>
									<div className="space-y-2">
										<Input
											label="Cell Formatting (JSON)"
											placeholder='e.g. {"border":{"all":{"color":"255,0,0"}}}'
											value={cellFormatting}
											onChange={(e) => setCellFormatting(e.target.value)}
										/>
										<div className="flex flex-wrap gap-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													setFormattingPreset(
														'{"border":{"bottom":{"lineStyle":"Double"}}}',
													)
												}
											>
												Double Bottom Border
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													setFormattingPreset(
														'{"background":{"color":"100,100,100","pattern":"Grid"}}',
													)
												}
											>
												Grey Grid Background
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													setFormattingPreset(
														'{"alignment":{"horizontal":"Center","vertical":"Center"},"background":{"color":"180,198,231"},"mergeCells":true}',
													)
												}
											>
												Merged Centered Blue
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													setFormattingPreset(
														'{"border":{"all":{"color":"255,0,0"}}}',
													)
												}
											>
												Red Border
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													setFormattingPreset(
														'{"font":{"bold":true,"color":"191,143,0","italic":true,"name":"Times New Roman","size":14}}',
													)
												}
											>
												Times Large Font
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													setFormattingPreset('{"numberFormat":"#,##0"}')
												}
											>
												Number 1000s Separator
											</Button>
										</div>
										<Button
											variant="secondary"
											onClick={handleSetCellFormatting}
											disabled={
												disabled || !worksheetId || !cellRange || !cellFormatting
											}
											icon={<FaFont />}
										>
											Set Formatting
										</Button>
									</div>
								</div>

								<div className="border-t border-gray-200 pt-4">
									<h3 className="text-sm font-medium text-gray-900 mb-2">
										Deprecated Functions
									</h3>
									<div className="flex flex-wrap gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={handleLegacyGetCells}
											disabled={disabled || !worksheetId || !cellRange}
										>
											Get Cells (Legacy)
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleLegacyClearCells}
											disabled={disabled || !worksheetId || !cellRange}
										>
											Clear Cells (Legacy)
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleLegacyClearCellValues}
											disabled={disabled || !worksheetId || !cellRange}
										>
											Clear Values (Legacy)
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleLegacyClearCellFormatting}
											disabled={disabled || !worksheetId || !cellRange}
										>
											Clear Formatting (Legacy)
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleLegacySetCellName}
											disabled={disabled || !worksheetId || !cellRange || !cellName}
										>
											Set Name (Legacy)
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleLegacySetCellValues}
											disabled={disabled || !worksheetId || !cellRange || !valuesMap}
										>
											Set Values (Legacy)
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleLegacySetCellFormatting}
											disabled={
												disabled || !worksheetId || !cellRange || !cellFormatting
											}
										>
											Set Formatting (Legacy)
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Filtering */}
				<Accordion.Item value="filtering">
					<Accordion.Trigger value="filtering" icon={<FaFilter />}>
						Filtering
					</Accordion.Trigger>
					<Accordion.Content value="filtering">
						<div className="space-y-4">
							<p className="text-sm text-gray-600">
								Apply filters to cell ranges based on criteria
							</p>
							<Input
								label="Cell Range"
								placeholder="e.g. A1:D10"
								value={cellRange}
								onChange={(e) => setCellRange(e.target.value)}
							/>
							<Input
								label="Column Index"
								placeholder='"1" represents the left-most column in the range'
								value={filterField}
								onChange={(e) => setFilterField(e.target.value)}
							/>
							<Input
								label="Filter Operator"
								placeholder="e.g. Or/And/Top10Items/Bottom10Items/Top10Percent/Bottom10Percent/FilterValues"
								value={filterOp}
								onChange={(e) => setFilterOp(e.target.value)}
							/>
							<Input
								label="Criteria 1 (optional)"
								placeholder="e.g. >100"
								value={filterCriteria1}
								onChange={(e) => setFilterCriteria1(e.target.value)}
							/>
							<Input
								label="Criteria 2 (optional)"
								placeholder="e.g. <200"
								value={filterCriteria2}
								onChange={(e) => setFilterCriteria2(e.target.value)}
							/>
							<Input
								label="Visible Drop Down (optional)"
								placeholder="true/false"
								value={filterVisibleDropDown}
								onChange={(e) => setFilterVisibleDropDown(e.target.value)}
							/>
							<Button
								variant="primary"
								onClick={handleSetFilter}
								disabled={disabled || !worksheetId || !cellRange || !filterField || !filterOp}
								icon={<FaFilter />}
							>
								Set Filter
							</Button>

							<div className="border-t border-gray-200 pt-4">
								<h3 className="text-sm font-medium text-gray-900 mb-2">
									Deprecated Functions
								</h3>
								<Button
									variant="outline"
									size="sm"
									onClick={handleLegacyFilterCells}
									disabled={
										disabled || !worksheetId || !cellRange || !filterField || !filterOp
									}
								>
									Filter Cells (Legacy)
								</Button>
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Streaming */}
				<Accordion.Item value="streaming">
					<Accordion.Trigger value="streaming" icon={<FaStream />}>
						Streaming Data
					</Accordion.Trigger>
					<Accordion.Content value="streaming">
						<div className="space-y-4">
							<p className="text-sm text-gray-600">
								Stream live data from an API endpoint to a cell range
							</p>
							<Input
								label="Cell Range"
								placeholder="e.g. A1"
								value={cellRange}
								onChange={(e) => setCellRange(e.target.value)}
							/>
							<Input
								label="Source Data API Endpoint URL"
								value={streamingApiEndpoint}
								onChange={(e) => setStreamingApiEndpoint(e.target.value)}
							/>
							<Input
								label="Data Address"
								placeholder="e.g. number"
								value={streamingDataAddress}
								onChange={(e) => setStreamingDataAddress(e.target.value)}
								helperText="JavaScript property path to extract from JSON response"
							/>
							<Input
								label="Update Interval (ms) (optional)"
								placeholder="Defaults to 1000"
								value={streamingUpdateInterval}
								onChange={(e) => setStreamingUpdateInterval(e.target.value)}
							/>
							{isStreaming ? (
								<Button variant="destructive" onClick={handleStopStreaming} icon={<FaStop />}>
									Stop Streaming
								</Button>
							) : (
								<Button
									variant="primary"
									onClick={handleStartStreaming}
									disabled={
										disabled ||
										!worksheetId ||
										!cellRange ||
										!streamingApiEndpoint ||
										!streamingDataAddress
									}
									icon={<FaPlay />}
								>
									Start Streaming
								</Button>
							)}

							<div className="border-t border-gray-200 pt-4">
								<h3 className="text-sm font-medium text-gray-900 mb-2">
									Deprecated Functions
								</h3>
								{isStreaming ? (
									<Button
										variant="outline"
										size="sm"
										onClick={handleStopStreaming}
										icon={<FaStop />}
									>
										Stop Streaming (Legacy)
									</Button>
								) : (
									<Button
										variant="outline"
										size="sm"
										onClick={handleLegacyStartStreaming}
										disabled={
											disabled ||
											!worksheetId ||
											!cellRange ||
											!streamingApiEndpoint ||
											!streamingDataAddress
										}
										icon={<FaPlay />}
									>
										Start Streaming (Legacy)
									</Button>
								)}
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Events */}
				<Accordion.Item value="events">
					<Accordion.Trigger value="events" icon={<FaBell />}>
						Event Listeners
					</Accordion.Trigger>
					<Accordion.Content value="events">
						<div className="space-y-4">
							<div>
								<h3 className="text-sm font-medium text-gray-900 mb-2">Worksheet Events</h3>
								<p className="text-sm text-gray-600 mb-3">
									Register event listeners for worksheet-level events
								</p>
								<div className="flex flex-wrap gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => registerWorksheetEvent("activate")}
										disabled={disabled || !worksheetId}
									>
										activate
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											registerWorksheetEvent("change", (...args: [Cell[]]) => {
												const [changedCells] = args;
												return `changedCells: ${JSON.stringify(changedCells)}`;
											})
										}
										disabled={disabled || !worksheetId}
									>
										change
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => registerWorksheetEvent("deactivate")}
										disabled={disabled || !worksheetId}
									>
										deactivate
									</Button>
								</div>
							</div>

							<div className="border-t border-gray-200 pt-4">
								<h3 className="text-sm font-medium text-gray-900 mb-2">Cell Range Events</h3>
								<p className="text-sm text-gray-600 mb-3">
									Register event listeners for specific cell ranges
								</p>
								<Input
									label="Cell Range"
									placeholder="e.g. A1:D10"
									value={cellRange}
									onChange={(e) => setCellRange(e.target.value)}
								/>
								<div className="flex flex-wrap gap-2 mt-3">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											registerCellRangeEvent("change", (...args: [Cell[]]) => {
												const [changedCells] = args;
												return `changedCells: ${JSON.stringify(changedCells)}`;
											})
										}
										disabled={disabled || !worksheetId || !cellRange}
									>
										change
									</Button>
								</div>
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>
		</div>
	);
}
