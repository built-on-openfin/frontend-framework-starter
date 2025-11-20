import "allotment/dist/style.css";
import { Allotment } from "allotment";
import * as React from "react";
import { FaFileExcel } from "react-icons/fa";
import { Initialization } from "./components/initialization";
import { Application } from "./components/application";
import { Workbook } from "./components/workbook";
import { Worksheet } from "./components/worksheet";
import { Events } from "./components/events";
import { OutputPanel } from "./components/output-panel";
import { WorkbookList } from "./components/ui/workbook-list";
import { Card } from "./components/ui/card";
import { Accordion } from "./components/ui/accordion";
import { useExcelState } from "./hooks/use-excel-state";
import { useWorkbookList } from "./hooks/use-workbook-list";

export function ExcelDevtools() {
	const {
		excelApplication,
		setExcelApplication,
		eventLog,
		addMessageToEventLog,
		clearEventLog,
		output,
		setOutput,
		setErrorOutput,
		registeredEvents,
		addRegisteredEvent,
		deregisterEventById,
		getNewRegisteredEventId,
		history,
		addHistoryEntry,
		clearHistory,
	} = useExcelState();

	const { workbooks, isLoading, refresh, selectedWorkbookId, setSelectedWorkbookId } =
		useWorkbookList(excelApplication);

	const uuid = fin?.me?.uuid ?? crypto.randomUUID();
	const sidebarWidthStorageKey = React.useRef<string>(`${uuid}_sidebarWidth`);
	const outputHeightStorageKey = React.useRef<string>(`${uuid}_outputHeight`);

	const getSidebarWidth = (): string => {
		return localStorage.getItem(sidebarWidthStorageKey.current) ?? "20%";
	};

	const getOutputHeight = (): string => {
		return localStorage.getItem(outputHeightStorageKey.current) ?? "25%";
	};

	const updateSidebarWidth = (newSizes: number[]): void => {
		const newSize = newSizes?.[0];
		if (newSize) {
			const newWidth = Math.round((newSize / window.innerWidth) * 100);
			localStorage.setItem(sidebarWidthStorageKey.current, `${newWidth}%`);
		}
	};

	const updateOutputHeight = (newSizes: number[]): void => {
		const newSize = newSizes.at(1);
		if (newSize) {
			const newHeight = Math.round((newSize / window.innerHeight) * 100);
			localStorage.setItem(outputHeightStorageKey.current, `${newHeight}%`);
		}
	};

	return (
		<div className="h-screen flex flex-col bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-300 px-3 py-2">
				<div className="flex items-center gap-3">
					<FaFileExcel className="text-2xl text-green-600" />
					<div>
						<h1 className="text-xl font-semibold text-gray-900">Excel DevTool</h1>
						<p className="text-xs text-gray-600">Manage and interact with Excel workbooks</p>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 flex overflow-hidden">
				<Allotment onChange={updateSidebarWidth}>
					{/* Sidebar - Workbook List */}
					<Allotment.Pane preferredSize={getSidebarWidth()} minSize={200}>
						<WorkbookList
							workbooks={workbooks}
							selectedId={selectedWorkbookId}
							onSelect={setSelectedWorkbookId}
							onRefresh={refresh}
							isLoading={isLoading}
						/>
					</Allotment.Pane>

					{/* Main Content Area */}
					<Allotment.Pane>
						<Allotment vertical onChange={updateOutputHeight}>
							{/* Top Section - Controls */}
							<Allotment.Pane>
								<div className="h-full overflow-auto bg-gray-50 p-3">
									<div className="max-w-7xl mx-auto space-y-3">
										{/* Initialization & Application */}
										<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
											<Card>
												<Card.Content className="!p-3">
													<Initialization
														onConnect={setExcelApplication}
														onError={setErrorOutput}
														setOutput={setOutput}
													/>
												</Card.Content>
											</Card>

											<Card>
												<Card.Content className="!p-3">
													<Application
														excelApplication={excelApplication}
														setOutput={setOutput}
														setErrorOutput={setErrorOutput}
														onRefreshWorkbooks={refresh}
													/>
												</Card.Content>
											</Card>
										</div>

										{/* Main Sections - Accordion */}
										<Accordion
											defaultOpen={["workbook", "worksheet", "events"]}
											className="space-y-2"
										>
											{/* Workbook Section */}
											<Accordion.Item value="workbook">
												<Accordion.Trigger
													value="workbook"
													icon={<FaFileExcel />}
													className="px-3 py-2"
												>
													Workbook Operations
												</Accordion.Trigger>
												<Accordion.Content value="workbook" className="!px-3 !py-2">
													<Workbook
														excelApplication={excelApplication}
														selectedWorkbookId={selectedWorkbookId || ""}
														setOutput={setOutput}
														setErrorOutput={setErrorOutput}
														addRegisteredEvent={addRegisteredEvent}
														addMessageToEventLog={addMessageToEventLog}
														getNewRegisteredEventId={getNewRegisteredEventId}
														onRefreshWorkbooks={refresh}
													/>
												</Accordion.Content>
											</Accordion.Item>

											{/* Worksheet Section */}
											<Accordion.Item value="worksheet">
												<Accordion.Trigger
													value="worksheet"
													icon={<FaFileExcel />}
													className="px-3 py-2"
												>
													Worksheet Operations
												</Accordion.Trigger>
												<Accordion.Content value="worksheet" className="!px-3 !py-2">
													<Worksheet
														excelApplication={excelApplication}
														selectedWorkbookId={selectedWorkbookId || ""}
														setOutput={setOutput}
														setErrorOutput={setErrorOutput}
														addRegisteredEvent={addRegisteredEvent}
														addMessageToEventLog={addMessageToEventLog}
														getNewRegisteredEventId={getNewRegisteredEventId}
													/>
												</Accordion.Content>
											</Accordion.Item>

											{/* Events Section */}
											<Accordion.Item value="events">
												<Accordion.Trigger value="events" className="px-3 py-2">
													Registered Events
												</Accordion.Trigger>
												<Accordion.Content value="events" className="!px-3 !py-2">
													<Events
														registeredEvents={registeredEvents}
														deregisterEventById={deregisterEventById}
													/>
												</Accordion.Content>
											</Accordion.Item>
										</Accordion>
									</div>
								</div>
							</Allotment.Pane>

							{/* Bottom Section - Output Panel */}
							<Allotment.Pane preferredSize={getOutputHeight()} minSize={120}>
								<OutputPanel
									output={output}
									eventLog={eventLog}
									history={history}
									onClearEventLog={clearEventLog}
									onClearHistory={clearHistory}
								/>
							</Allotment.Pane>
						</Allotment>
					</Allotment.Pane>
				</Allotment>
			</div>
		</div>
	);
}
