import * as React from "react";
import { FaBell, FaTrash } from "react-icons/fa";
import { type EventsProps } from "../types";
import { Button } from "./ui/button";

export function Events({ registeredEvents, deregisterEventById }: EventsProps) {
	const [selectedEventId, setSelectedEventId] = React.useState<number | null>(null);

	const handleDeregister = () => {
		if (selectedEventId !== null) {
			deregisterEventById(selectedEventId);
			setSelectedEventId(null);
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
					<FaBell className="text-purple-600" />
					Registered Events
				</h2>
				<p className="mt-1 text-sm text-gray-600">
					View and manage all registered event listeners. Select an event to deregister it.
				</p>
			</div>

			{registeredEvents.length === 0 ? (
				<div className="text-sm italic text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
					No events have been registered yet.
				</div>
			) : (
				<div className="space-y-3">
					<div className="border border-gray-300 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
						{registeredEvents.map((event) => (
							<button
								key={event.id}
								type="button"
								onClick={() => setSelectedEventId(event.id)}
								className={`
									w-full px-4 py-3 text-left
									border-b border-gray-200 last:border-b-0
									transition-colors duration-150
									hover:bg-purple-50
									${selectedEventId === event.id ? "bg-purple-100 border-l-4 border-l-purple-600" : "bg-white"}
								`
									.trim()
									.replace(/\s+/g, " ")}
							>
								<div className="flex items-start justify-between gap-3">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-purple-600 rounded-full">
												{event.id}
											</span>
											<span className="font-medium text-gray-900 truncate">
												{event.title}
											</span>
										</div>
									</div>
									{selectedEventId === event.id && (
										<span className="text-xs text-purple-600 font-medium">Selected</span>
									)}
								</div>
							</button>
						))}
					</div>

					<Button
						variant="destructive"
						onClick={handleDeregister}
						disabled={selectedEventId === null}
						icon={<FaTrash />}
					>
						Deregister Selected Event
					</Button>

					<div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
						<strong>Total Events:</strong> {registeredEvents.length}
					</div>
				</div>
			)}
		</div>
	);
}
