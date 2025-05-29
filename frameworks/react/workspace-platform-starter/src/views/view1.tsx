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
		<div className="flex-col">
			<button type="button" onClick={handleViewContact}>
				View Contact
			</button>
			<button type="button" onClick={handleViewQuote}>
				View Quote
			</button>
			<button type="button" onClick={handleSetGlobalState}>
				Set global state
			</button>
		</div>
	);
}
