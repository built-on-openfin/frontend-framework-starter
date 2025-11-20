import { getExcelApplication } from "@openfin/excel";
import * as React from "react";
import { type InitializationProps } from "../types";
import { Button } from "./ui/button";
import { FaPlug } from "react-icons/fa";

export function Initialization({ onConnect, onError, setOutput }: InitializationProps) {
	const [isConnecting, setIsConnecting] = React.useState(false);

	const handleConnect = async () => {
		setIsConnecting(true);
		try {
			const excelApp = await getExcelApplication(true);
			setOutput(
				`Connected to adapter version ${excelApp.adapter.version} on channel ${excelApp.adapter.channelName}`,
			);
			onConnect(excelApp);
			Object.assign(window, { excelApp });
		} catch (err) {
			onError(err instanceof Error ? err : new Error("Failed to connect to Excel"));
		} finally {
			setIsConnecting(false);
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-gray-900">Initialization</h2>
				<p className="mt-1 text-sm text-gray-600">
					Connect to the Excel adapter to enable all actions below.
				</p>
			</div>
			<Button variant="primary" onClick={handleConnect} disabled={isConnecting} icon={<FaPlug />}>
				{isConnecting ? "Connecting..." : "Connect to Excel"}
			</Button>
		</div>
	);
}
