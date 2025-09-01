import { usePlatformState } from "../hooks/usePlatformState";

export function View2() {
	const [myState] = usePlatformState<string>("demo");

	return (
		<>
			<div>View 2</div>
			<h1>{myState}</h1>
		</>
	);
}
