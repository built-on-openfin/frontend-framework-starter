import { useIntentListener } from "../hooks/use-intent-listener.tsx";
import { useOpenFinWeb } from "../hooks/use-openfin-web.tsx";

export function ViewContact() {
	useOpenFinWeb();
	const { context, loading, error } = useIntentListener("ViewContact");

	const clickHandler = () => {
		console.log(window.fdc3);
		console.log(window.fin);
	};

	return (
		<>
			<div>View Contact</div>

			<div>{context?.name}</div>
			<div>{loading}</div>
			<div>{error}</div>

			<button type="button" onClick={clickHandler}>
				Test
			</button>
		</>
	);
}
