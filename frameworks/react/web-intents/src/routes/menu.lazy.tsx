import { createLazyFileRoute } from "@tanstack/react-router";
import { useConnect } from "../hooks/useConnect.ts";
import { useRaiseIntent } from "../hooks/useRaiseIntent.ts";

export const Route = createLazyFileRoute("/menu")({
	component: Menu,
});

export function Menu() {
	const { finReady, fdc3Ready } = useConnect();
	const raiseIntent = useRaiseIntent();

	const handleClick = () => {
		if (finReady && fdc3Ready) {
			void raiseIntent("intent.test", { type: "test" });
		} else {
			console.error("APIs not ready");
		}
	};

	return (
		<div>
			<h1>Menu</h1>
			<button onClick={handleClick}>Raise Intent</button>
		</div>
	);
}
