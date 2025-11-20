import { type ExcelWorksheet, type WindowBounds } from "@openfin/excel";
import * as React from "react";
import {
	FaBell,
	FaCalculator,
	FaExpand,
	FaFile,
	FaFolderOpen,
	FaList,
	FaPlay,
	FaPlus,
	FaSave,
	FaTimes,
} from "react-icons/fa";
import { type WorkbookProps } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Accordion } from "./ui/accordion";

export function Workbook({
	excelApplication,
	selectedWorkbookId,
	setOutput,
	setErrorOutput,
	addRegisteredEvent,
	addMessageToEventLog,
	getNewRegisteredEventId,
	onRefreshWorkbooks,
}: WorkbookProps) {
	const [workbookPath, setWorkbookPath] = React.useState("");
	const [workbookId, setWorkbookId] = React.useState(selectedWorkbookId || "");
	const [worksheetName, setWorksheetName] = React.useState("");
	const [saveAsPath, setSaveAsPath] = React.useState("");
	const [windowBounds, setWindowBounds] = React.useState("");

	// Update workbook ID when selected from list
	React.useEffect(() => {
		if (selectedWorkbookId) {
			setWorkbookId(selectedWorkbookId);
		}
	}, [selectedWorkbookId]);

	const disabled = !excelApplication;

	// File Operations
	const handleOpenWorkbook = async () => {
		try {
			const result = await excelApplication!.openWorkbook(workbookPath);
			setOutput(result);
			onRefreshWorkbooks?.();
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleSave = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const savePath = await workbook.save();
			setOutput(`Saved workbook to ${savePath}`);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleSaveAs = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const savePath = await workbook.saveAs(saveAsPath);
			setOutput(`Saved workbook to ${savePath}`);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleClose = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			await workbook.close();
			setOutput("Workbook closed");
			onRefreshWorkbooks?.();
		} catch (err) {
			setErrorOutput(err);
		}
	};

	// Workbook Info
	const handleGetWorkbook = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			setOutput(workbook);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetName = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const name = await workbook.getName();
			setOutput(name);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetFilePath = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const filePath = await workbook.getFilePath();
			setOutput(filePath);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	// Window Management
	const handleActivate = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			await workbook.activate();
			setOutput("Workbook activated");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetWindowBounds = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const bounds = await workbook.getWindowBounds();
			setOutput(bounds);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleSetWindowBounds = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const newBounds: WindowBounds = JSON.parse(windowBounds);
			await workbook.setWindowBounds(newBounds);
			setOutput("Window bounds updated");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	// Worksheet Operations
	const handleAddWorksheet = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const newWorksheet = await workbook.addWorksheet();
			setOutput(newWorksheet);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetActiveWorksheet = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const worksheet = await workbook.getActiveWorksheet();
			setOutput(worksheet);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetWorksheets = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const worksheets = await workbook.getWorksheets();
			setOutput(worksheets);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetWorksheetByName = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const worksheet = await workbook.getWorksheetByName(worksheetName);
			setOutput(worksheet);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	// Calculation
	const handleCalculate = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			await workbook.calculate();
			setOutput("Calculation complete");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetCalculationMode = async () => {
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const mode = await workbook.getCalculationMode();
			setOutput(mode);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	// Events
	const registerEvent = async (eventName: string, handler?: (...args: any[]) => string) => {
		const id = getNewRegisteredEventId();
		try {
			const workbook = await excelApplication!.getWorkbookById(workbookId);
			const title = `workbook:${workbook.objectId}:${eventName}`;
			const listener = (...args: any[]) => {
				let message = `${id}; ${title}`;
				if (handler) {
					message += `; ${handler(...args)}`;
				}
				addMessageToEventLog(message);
			};
			const registeredEvent = {
				deregister: () => {
					workbook.removeEventListener(listener);
				},
				title,
				id,
			};
			await workbook.addEventListener(eventName, listener);
			addRegisteredEvent(registeredEvent);
			setOutput(`Registered event ${title} (${id})`);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-gray-900">Workbook Operations</h2>
				<p className="mt-1 text-sm text-gray-600">
					Open, inspect, and control a specific workbook. Provide a file path or select from the
					list.
				</p>
			</div>

			<Accordion defaultOpen={["file", "info"]}>
				{/* File Operations */}
				<Accordion.Item value="file">
					<Accordion.Trigger value="file" icon={<FaFolderOpen />}>
						File Operations
					</Accordion.Trigger>
					<Accordion.Content value="file">
						<div className="space-y-4">
							{/* Open Workbook */}
							<div className="space-y-2">
								<Input
									label="Workbook File Path"
									placeholder="e.g. C:\files\example.xlsx"
									value={workbookPath}
									onChange={(e) => setWorkbookPath(e.target.value)}
								/>
								<Button
									variant="primary"
									onClick={handleOpenWorkbook}
									disabled={disabled || !workbookPath}
									icon={<FaFolderOpen />}
								>
									Open Workbook
								</Button>
							</div>

							<div className="border-t border-gray-200 pt-4">
								<Input
									label="Workbook ID"
									placeholder="e.g. Workbook1"
									value={workbookId}
									onChange={(e) => setWorkbookId(e.target.value)}
									helperText="Select from list or enter manually"
								/>
							</div>

							{/* Save Operations */}
							<div className="flex flex-wrap gap-2">
								<Button
									variant="primary"
									onClick={handleSave}
									disabled={disabled || !workbookId}
									icon={<FaSave />}
								>
									Save
								</Button>
								<Button
									variant="destructive"
									onClick={handleClose}
									disabled={disabled || !workbookId}
									icon={<FaTimes />}
								>
									Close
								</Button>
							</div>

							{/* Save As */}
							<div className="space-y-2 pt-4 border-t border-gray-200">
								<Input
									label="Save As Path"
									placeholder="e.g. C:\files\copy.xlsx"
									value={saveAsPath}
									onChange={(e) => setSaveAsPath(e.target.value)}
								/>
								<Button
									variant="secondary"
									onClick={handleSaveAs}
									disabled={disabled || !workbookId || !saveAsPath}
									icon={<FaSave />}
								>
									Save As
								</Button>
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Workbook Info */}
				<Accordion.Item value="info">
					<Accordion.Trigger value="info" icon={<FaFile />}>
						Workbook Info
					</Accordion.Trigger>
					<Accordion.Content value="info">
						<div className="flex flex-wrap gap-2">
							<Button
								variant="secondary"
								size="sm"
								onClick={handleGetWorkbook}
								disabled={disabled || !workbookId}
							>
								Get Workbook
							</Button>
							<Button
								variant="secondary"
								size="sm"
								onClick={handleGetName}
								disabled={disabled || !workbookId}
							>
								Get Name
							</Button>
							<Button
								variant="secondary"
								size="sm"
								onClick={handleGetFilePath}
								disabled={disabled || !workbookId}
							>
								Get File Path
							</Button>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Window Management */}
				<Accordion.Item value="window">
					<Accordion.Trigger value="window" icon={<FaExpand />}>
						Window Management
					</Accordion.Trigger>
					<Accordion.Content value="window">
						<div className="space-y-4">
							<div className="flex flex-wrap gap-2">
								<Button
									variant="primary"
									onClick={handleActivate}
									disabled={disabled || !workbookId}
									icon={<FaPlay />}
								>
									Activate
								</Button>
								<Button
									variant="secondary"
									onClick={handleGetWindowBounds}
									disabled={disabled || !workbookId}
								>
									Get Window Bounds
								</Button>
							</div>
							<div className="space-y-2">
								<Input
									label="Window Bounds (JSON)"
									placeholder='e.g. {"height":500,"left":0,"top":0,"width":800}'
									value={windowBounds}
									onChange={(e) => setWindowBounds(e.target.value)}
								/>
								<Button
									variant="secondary"
									onClick={handleSetWindowBounds}
									disabled={disabled || !workbookId || !windowBounds}
								>
									Set Window Bounds
								</Button>
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Worksheet Operations */}
				<Accordion.Item value="worksheets">
					<Accordion.Trigger value="worksheets" icon={<FaList />}>
						Worksheet Operations
					</Accordion.Trigger>
					<Accordion.Content value="worksheets">
						<div className="space-y-4">
							<div className="flex flex-wrap gap-2">
								<Button
									variant="primary"
									onClick={handleAddWorksheet}
									disabled={disabled || !workbookId}
									icon={<FaPlus />}
								>
									Add Worksheet
								</Button>
								<Button
									variant="secondary"
									onClick={handleGetActiveWorksheet}
									disabled={disabled || !workbookId}
								>
									Get Active Worksheet
								</Button>
								<Button
									variant="secondary"
									onClick={handleGetWorksheets}
									disabled={disabled || !workbookId}
								>
									Get All Worksheets
								</Button>
							</div>
							<div className="space-y-2 pt-4 border-t border-gray-200">
								<Input
									label="Worksheet Name"
									placeholder="e.g. Sheet1"
									value={worksheetName}
									onChange={(e) => setWorksheetName(e.target.value)}
								/>
								<Button
									variant="secondary"
									onClick={handleGetWorksheetByName}
									disabled={disabled || !workbookId || !worksheetName}
								>
									Get Worksheet By Name
								</Button>
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Calculation */}
				<Accordion.Item value="calculation">
					<Accordion.Trigger value="calculation" icon={<FaCalculator />}>
						Calculation
					</Accordion.Trigger>
					<Accordion.Content value="calculation">
						<div className="flex flex-wrap gap-2">
							<Button
								variant="primary"
								onClick={handleCalculate}
								disabled={disabled || !workbookId}
								icon={<FaCalculator />}
							>
								Calculate
							</Button>
							<Button
								variant="secondary"
								onClick={handleGetCalculationMode}
								disabled={disabled || !workbookId}
							>
								Get Calculation Mode
							</Button>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Events */}
				<Accordion.Item value="events">
					<Accordion.Trigger value="events" icon={<FaBell />}>
						Event Listeners
					</Accordion.Trigger>
					<Accordion.Content value="events">
						<div className="space-y-2">
							<p className="text-sm text-gray-600 mb-3">
								Register event listeners for workbook events
							</p>
							<div className="flex flex-wrap gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => registerEvent("activate")}
									disabled={disabled || !workbookId}
								>
									activate
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										registerEvent("activateWorksheet", (...args: [ExcelWorksheet]) => {
											const [worksheet] = args;
											return `worksheet: ${worksheet.objectId}`;
										})
									}
									disabled={disabled || !workbookId}
								>
									activateWorksheet
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										registerEvent("addWorksheet", (...args: [ExcelWorksheet]) => {
											const [worksheet] = args;
											return `worksheet: ${worksheet.objectId}`;
										})
									}
									disabled={disabled || !workbookId}
								>
									addWorksheet
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => registerEvent("close")}
									disabled={disabled || !workbookId}
								>
									close
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => registerEvent("deactivate")}
									disabled={disabled || !workbookId}
								>
									deactivate
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										registerEvent("deleteWorksheet", (...args: [string]) => {
											const [worksheetName] = args;
											return `worksheet: ${worksheetName}`;
										})
									}
									disabled={disabled || !workbookId}
								>
									deleteWorksheet
								</Button>
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>
		</div>
	);
}
