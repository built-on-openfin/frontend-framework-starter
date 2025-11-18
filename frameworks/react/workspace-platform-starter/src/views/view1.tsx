import { usePlatformState } from "../hooks/usePlatformState";
import { useRaiseIntent } from "../hooks/useRaiseIntent";

export function View1() {
	const raiseIntent = useRaiseIntent();
	const [, setMyState] = usePlatformState<string>("demo", "");

	const handleViewContact = () => {
		raiseIntent("ViewContact", { type: "fdc3.contact" });
	};

	const handleViewQuote = () => {
		raiseIntent("ViewQuote", { type: "custom.instrument" });
	};

	const handleSetGlobalState = () => {
		setMyState("Hello World!");
	};

	return (
		// Center content with flexbox and add spacing
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 bg-[var(--background)]">
			<button
				type="button"
				onClick={handleViewContact}
				className="px-6 py-3 rounded-md bg-blue-600 text-white font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors"
			>
				View Contact
			</button>
			<button
				type="button"
				onClick={handleViewQuote}
				className="px-6 py-3 rounded-md bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-colors"
			>
				View Quote
			</button>
			<button
				type="button"
				onClick={handleSetGlobalState}
				className="px-6 py-3 rounded-md bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-colors"
			>
				Set global state
			</button>
		</div>
	);
}
