import * as React from "react";
import { type ExcelApplication } from "@openfin/excel";
import { type WorkbookInfo } from "../types";

type UseWorkbookListReturn = {
	workbooks: WorkbookInfo[];
	isLoading: boolean;
	error: Error | null;
	refresh: () => Promise<void>;
	selectedWorkbookId: string | null;
	setSelectedWorkbookId: (id: string | null) => void;
};

export function useWorkbookList(excelApplication: ExcelApplication | null): UseWorkbookListReturn {
	const [workbooks, setWorkbooks] = React.useState<WorkbookInfo[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<Error | null>(null);
	const [selectedWorkbookId, setSelectedWorkbookId] = React.useState<string | null>(null);

	const refresh = React.useCallback(async () => {
		if (!excelApplication) {
			setWorkbooks([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Get all workbooks
			const allWorkbooks = await excelApplication.getWorkbooks();

			// Get active workbook ID
			let activeWorkbookId: string | null = null;
			try {
				const activeWorkbook = await excelApplication.getWorkbookById("");
				activeWorkbookId = activeWorkbook?.objectId || null;
			} catch {
				// No active workbook
			}

			// Map workbooks to WorkbookInfo
			const workbookInfos: WorkbookInfo[] = await Promise.all(
				allWorkbooks.map(async (wb) => {
					let name = "Unknown";
					let path = "";

					try {
						name = await wb.getName();
					} catch {
						// Use ID if name fails
						name = wb.objectId;
					}

					try {
						path = await wb.getFilePath();
					} catch {
						// Path may not be available
					}

					return {
						id: wb.objectId,
						name,
						path,
						isActive: wb.objectId === activeWorkbookId,
					};
				}),
			);

			setWorkbooks(workbookInfos);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to fetch workbooks"));
			setWorkbooks([]);
		} finally {
			setIsLoading(false);
		}
	}, [excelApplication]);

	// Auto-refresh when Excel application changes
	React.useEffect(() => {
		refresh();
	}, [refresh]);

	return {
		workbooks,
		isLoading,
		error,
		refresh,
		selectedWorkbookId,
		setSelectedWorkbookId,
	};
}
