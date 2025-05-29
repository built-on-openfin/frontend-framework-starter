import { useOpenFin } from "./hooks/useOpenFin";

export function Provider() {
	useOpenFin();

	return <h1>Provider</h1>;
}
