import { disableLogging, enableLogging } from "@openfin/excel";
import * as React from "react";
import { defaultStyles, JsonView } from "react-json-view-lite";
import { FaClock, FaCopy, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { type OutputPanelProps } from "../types";
import { Tabs } from "./ui/tabs";
import { Button } from "./ui/button";

import "react-json-view-lite/dist/index.css";

export function OutputPanel({
	output,
	eventLog,
	history,
	onClearEventLog,
	onClearHistory,
}: OutputPanelProps) {
	const [loggingEnabled, setLoggingEnabled] = React.useState(true);

	React.useEffect(() => {
		// Keep behavior consistent with previous header: logging starts enabled
		enableLogging();
	}, []);

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// ignore
		}
	};

	const handleCopyOutput = async () => {
		const text = typeof output === "object" ? JSON.stringify(output, null, 2) : String(output ?? "");
		await copyToClipboard(text);
	};

	const handleCopyEventLog = async () => {
		await copyToClipboard(String(eventLog ?? ""));
	};

	const handleToggleLogging = () => {
		if (loggingEnabled) {
			disableLogging();
			setLoggingEnabled(false);
		} else {
			enableLogging();
			setLoggingEnabled(true);
		}
	};

	const formatTimestamp = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		}).format(date);
	};

	return (
		<div className="h-full flex flex-col bg-white border-t border-gray-300">
			<Tabs defaultValue="output" className="flex-1 flex flex-col">
				<div className="border-b border-gray-300 px-3 pt-2">
					<Tabs.List>
						<Tabs.Trigger value="output">Output</Tabs.Trigger>
						<Tabs.Trigger value="events">Event Log</Tabs.Trigger>
						<Tabs.Trigger value="history">
							History {history.length > 0 && `(${history.length})`}
						</Tabs.Trigger>
					</Tabs.List>
				</div>

				{/* Output Tab */}
				<Tabs.Content value="output" className="flex-1 flex flex-col overflow-hidden">
					<div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
						<h2 className="text-sm font-semibold text-gray-900">Output</h2>
						<Button variant="ghost" size="sm" onClick={handleCopyOutput} icon={<FaCopy />}>
							Copy
						</Button>
					</div>
					<div className="flex-1 overflow-auto p-3">
						{output && typeof output === "object" ? (
							<div className="rounded border border-gray-200 p-2 bg-gray-50 overflow-auto">
								<JsonView data={output} style={defaultStyles} />
							</div>
						) : (
							<pre className="whitespace-pre-wrap rounded border border-gray-200 p-2 bg-gray-50 text-[13px] leading-5 overflow-auto font-mono">
								{typeof output === "string" ? output : JSON.stringify(output)}
							</pre>
						)}
					</div>
				</Tabs.Content>

				{/* Event Log Tab */}
				<Tabs.Content value="events" className="flex-1 flex flex-col overflow-hidden">
					<div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
						<h2 className="text-sm font-semibold text-gray-900">Event Log</h2>
						<div className="flex gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleToggleLogging}
								icon={loggingEnabled ? <FaToggleOn /> : <FaToggleOff />}
							>
								{loggingEnabled ? "Disable" : "Enable"} Logging
							</Button>
							<Button variant="ghost" size="sm" onClick={handleCopyEventLog} icon={<FaCopy />}>
								Copy
							</Button>
							<Button variant="ghost" size="sm" onClick={onClearEventLog} icon={<FaTrash />}>
								Clear
							</Button>
						</div>
					</div>
					<div className="flex-1 overflow-auto p-3">
						<pre className="whitespace-pre-wrap rounded border border-gray-200 p-2 bg-gray-50 text-[13px] leading-5 overflow-auto font-mono">
							{eventLog || "No events logged yet"}
						</pre>
					</div>
				</Tabs.Content>

				{/* History Tab */}
				<Tabs.Content value="history" className="flex-1 flex flex-col overflow-hidden">
					<div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
						<h2 className="text-sm font-semibold text-gray-900">Operation History</h2>
						<Button
							variant="ghost"
							size="sm"
							onClick={onClearHistory}
							disabled={history.length === 0}
							icon={<FaTrash />}
						>
							Clear
						</Button>
					</div>
					<div className="flex-1 overflow-auto">
						{history.length === 0 ? (
							<div className="p-3 text-center text-gray-500 text-sm">
								No operations in history yet
							</div>
						) : (
							<div className="divide-y divide-gray-200">
								{history.map((entry) => (
									<div key={entry.id} className="p-3 hover:bg-gray-50">
										<div className="flex items-center gap-2 mb-2">
											<FaClock className="text-gray-400 text-xs" />
											<span className="text-xs text-gray-500">
												{formatTimestamp(entry.timestamp)}
											</span>
											<span className="text-xs font-medium text-gray-700">
												{entry.action}
											</span>
										</div>
										{typeof entry.result === "object" ? (
											<div className="text-xs rounded border border-gray-200 p-2 bg-gray-50 overflow-auto max-h-28">
												<JsonView data={entry.result} style={defaultStyles} />
											</div>
										) : (
											<pre className="text-xs whitespace-pre-wrap rounded border border-gray-200 p-2 bg-gray-50 overflow-auto max-h-28 font-mono">
												{String(entry.result)}
											</pre>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</Tabs.Content>
			</Tabs>
		</div>
	);
}
