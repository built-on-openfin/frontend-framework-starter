import { useAppContext } from "../hooks/useAppContext";

export function ReceiveContext() {
	const { context } = useAppContext("CUSTOM-APP-CHANNEL-NAME");

	return (
		<div>
			<h4>Receive context</h4>
			<pre>{JSON.stringify(context, null, 2)}</pre>
		</div>
	);
}
