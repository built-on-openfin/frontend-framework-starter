import * as React from "react";
import { type ExcelApplication } from "@openfin/excel";
import { type HistoryEntry, type RegisteredEvent } from "../types";

type UseExcelStateReturn = {
	excelApplication: ExcelApplication | null;
	setExcelApplication: (app: ExcelApplication | null) => void;
	eventLog: string;
	addMessageToEventLog: (message: string) => void;
	clearEventLog: () => void;
	output: string | object | null;
	setOutput: (output: string | object | null) => void;
	setErrorOutput: (err: any) => void;
	registeredEvents: RegisteredEvent[];
	addRegisteredEvent: (event: RegisteredEvent) => void;
	deregisterEventById: (eventId: number) => void;
	getNewRegisteredEventId: () => number;
	history: HistoryEntry[];
	addHistoryEntry: (action: string, result: string | object) => void;
	clearHistory: () => void;
};

let eventLogStore = "";

export function useExcelState(): UseExcelStateReturn {
	const [excelApplication, setExcelApplication] = React.useState<ExcelApplication | null>(null);
	const [eventLog, setEventLog] = React.useState<string>(eventLogStore);
	const [output, setOutputState] = React.useState<string | object | null>("Not initialized");
	const [registeredEvents, setRegisteredEvents] = React.useState<RegisteredEvent[]>([]);
	const [history, setHistory] = React.useState<HistoryEntry[]>([]);

	const addMessageToEventLog = React.useCallback((message: string) => {
		eventLogStore = `${message}\n${eventLogStore}`;
		setEventLog(eventLogStore);
	}, []);

	const clearEventLog = React.useCallback(() => {
		eventLogStore = "";
		setEventLog(eventLogStore);
	}, []);

	const setOutput = React.useCallback((newOutput: string | object | null) => {
		setOutputState(newOutput);
	}, []);

	const setErrorOutput = React.useCallback((err: any) => {
		if (err instanceof Error) {
			setOutputState(`Error: \n${err.message}`);
		}
	}, []);

	const addRegisteredEvent = React.useCallback((event: RegisteredEvent) => {
		setRegisteredEvents((prev) => [...prev, event]);
	}, []);

	const deregisterEventById = React.useCallback((eventId: number) => {
		setRegisteredEvents((prev) => {
			const eventToDeregister = prev.find((x) => x.id === eventId);
			if (!eventToDeregister) {
				return prev;
			}
			eventToDeregister.deregister();
			setOutputState(`Deregistered event ${eventToDeregister.title} (${eventToDeregister.id})`);
			return prev.filter((x) => x.id !== eventId);
		});
	}, []);

	const getNewRegisteredEventId = React.useCallback(() => {
		const highestId = Math.max(...registeredEvents.map((x) => x.id).concat([0]));
		return highestId + 1;
	}, [registeredEvents]);

	const addHistoryEntry = React.useCallback((action: string, result: string | object) => {
		const entry: HistoryEntry = {
			id: crypto.randomUUID(),
			timestamp: new Date(),
			action,
			result,
		};
		setHistory((prev) => [entry, ...prev].slice(0, 50)); // Keep last 50 entries
	}, []);

	const clearHistory = React.useCallback(() => {
		setHistory([]);
	}, []);

	return {
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
	};
}
