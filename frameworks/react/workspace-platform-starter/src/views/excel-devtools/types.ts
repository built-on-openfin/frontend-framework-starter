import { type ExcelApplication } from "@openfin/excel";

export type RegisteredEvent = {
	id: number;
	title: string;
	deregister: () => void;
};

export type ExcelState = {
	application: ExcelApplication | null;
	eventLog: string;
	output: string | object | null;
	registeredEvents: RegisteredEvent[];
};

export type WorkbookInfo = {
	id: string;
	name: string;
	path: string;
	isActive: boolean;
};

export type OutputPanelTab = "output" | "events" | "history";

export type HistoryEntry = {
	id: string;
	timestamp: Date;
	action: string;
	result: string | object;
};

export type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost" | "outline";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export type InitializationProps = {
	onConnect: (app: ExcelApplication) => void;
	onError: (error: Error) => void;
	setOutput: (output: string | object) => void;
};

export type ApplicationProps = {
	excelApplication: ExcelApplication | null;
	setOutput: (output: string | object) => void;
	setErrorOutput: (error: any) => void;
	onRefreshWorkbooks?: () => void;
};

export type WorkbookProps = {
	excelApplication: ExcelApplication | null;
	selectedWorkbookId: string;
	setOutput: (output: string | object) => void;
	setErrorOutput: (error: any) => void;
	addRegisteredEvent: (event: RegisteredEvent) => void;
	addMessageToEventLog: (message: string) => void;
	getNewRegisteredEventId: () => number;
	onRefreshWorkbooks?: () => void;
};

export type WorksheetProps = {
	excelApplication: ExcelApplication | null;
	selectedWorkbookId: string;
	setOutput: (output: string | object) => void;
	setErrorOutput: (error: any) => void;
	addRegisteredEvent: (event: RegisteredEvent) => void;
	addMessageToEventLog: (message: string) => void;
	getNewRegisteredEventId: () => number;
};

export type EventsProps = {
	registeredEvents: RegisteredEvent[];
	deregisterEventById: (eventId: number) => void;
};

export type WorkbookListProps = {
	workbooks: WorkbookInfo[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	onRefresh: () => void;
	isLoading?: boolean;
};

export type OutputPanelProps = {
	output: string | object | null;
	eventLog: string;
	history: HistoryEntry[];
	onClearEventLog: () => void;
	onClearHistory: () => void;
};
