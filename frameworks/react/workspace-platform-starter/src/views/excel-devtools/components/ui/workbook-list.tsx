import * as React from "react";
import { FaCircle, FaFileExcel, FaSearch, FaSync } from "react-icons/fa";
import { type WorkbookListProps } from "../../types";
import { Button } from "./button";

export function WorkbookList({
	workbooks,
	selectedId,
	onSelect,
	onRefresh,
	isLoading = false,
}: WorkbookListProps) {
	const [searchQuery, setSearchQuery] = React.useState("");

	const filteredWorkbooks = workbooks.filter(
		(wb) =>
			wb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			wb.path.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="h-full flex flex-col bg-white border-r border-gray-300">
			{/* Header */}
			<div className="p-3 border-b border-gray-300">
				<div className="flex items-center justify-between mb-2">
					<h2 className="text-base font-semibold text-gray-900">Workbooks</h2>
					<Button
						variant="ghost"
						size="icon"
						onClick={onRefresh}
						disabled={isLoading}
						className={isLoading ? "animate-spin" : ""}
					>
						<FaSync className="text-gray-600" />
					</Button>
				</div>

				{/* Search */}
				<div className="relative">
					<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search workbooks..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="
							w-full pl-9 pr-3 py-2
							border border-gray-300 rounded-lg
							text-sm
							focus:outline-none focus:ring-2 focus:ring-[#0091EB] focus:border-transparent
						"
					/>
				</div>
			</div>

			{/* Workbook List */}
			<div className="flex-1 overflow-auto">
				{filteredWorkbooks.length === 0 && !isLoading && (
					<div className="p-4 text-center text-gray-500 text-sm">
						{workbooks.length === 0 ? "No workbooks open" : "No matches found"}
					</div>
				)}

				{filteredWorkbooks.map((workbook) => (
					<button
						key={workbook.id}
						type="button"
						onClick={() => onSelect(workbook.id)}
						className={`
							w-full p-3 border-b border-gray-200
							text-left
							transition-colors duration-150
							hover:bg-gray-50
							${selectedId === workbook.id ? "bg-blue-50 border-l-4 border-l-[#0091EB]" : ""}
						`
							.trim()
							.replace(/\s+/g, " ")}
					>
						<div className="flex items-start gap-3">
							<FaFileExcel className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-0.5">
									<h3 className="font-medium text-gray-900 truncate">{workbook.name}</h3>
									{workbook.isActive && (
										<FaCircle className="text-[#0091EB] text-xs flex-shrink-0" />
									)}
								</div>
								<p className="text-xs text-gray-500 truncate mb-0.5">ID: {workbook.id}</p>
								{workbook.path && (
									<p className="text-xs text-gray-400 truncate" title={workbook.path}>
										{workbook.path}
									</p>
								)}
							</div>
						</div>
					</button>
				))}
			</div>

			{/* Footer Info */}
			<div className="p-3 border-t border-gray-300 bg-gray-50">
				<p className="text-xs text-gray-600 text-center">
					{workbooks.length} {workbooks.length === 1 ? "workbook" : "workbooks"}
				</p>
			</div>
		</div>
	);
}
