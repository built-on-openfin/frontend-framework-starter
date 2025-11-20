import * as React from "react";
import { FaList, FaPlus, FaTimes } from "react-icons/fa";
import { type ApplicationProps } from "../types";
import { Button } from "./ui/button";

export function Application({
	excelApplication,
	setOutput,
	setErrorOutput,
	onRefreshWorkbooks,
}: ApplicationProps) {
	const disabled = !excelApplication;

	const handleCreateWorkbook = async () => {
		try {
			const newWorkbook = await excelApplication!.createWorkbook();
			setOutput(newWorkbook);
			onRefreshWorkbooks?.();
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleGetWorkbooks = async () => {
		try {
			const result = await excelApplication!.getWorkbooks();
			setOutput(result);
		} catch (err) {
			setErrorOutput(err);
		}
	};

	const handleQuitApplication = async () => {
		try {
			await excelApplication!.quit(false);
			setOutput("Excel application quit successfully");
		} catch (err) {
			setErrorOutput(err);
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-gray-900">Application</h2>
				<p className="mt-1 text-sm text-gray-600">
					Create and manage workbooks in the running Excel instance.
				</p>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button
					variant="primary"
					onClick={handleCreateWorkbook}
					disabled={disabled}
					icon={<FaPlus />}
				>
					Create Workbook
				</Button>
				<Button
					variant="secondary"
					onClick={handleGetWorkbooks}
					disabled={disabled}
					icon={<FaList />}
				>
					Get Workbooks
				</Button>
				<Button
					variant="destructive"
					onClick={handleQuitApplication}
					disabled={disabled}
					icon={<FaTimes />}
				>
					Quit Application
				</Button>
			</div>
		</div>
	);
}
