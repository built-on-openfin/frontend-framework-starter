import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";

export function SendContext() {
	const { setContext } = useAppContext("CUSTOM-APP-CHANNEL-NAME");
	const [contextToSend, setContextToSend] = useState("");

	const handleClick = () => {
		setContext({ type: "test" });
	};

	return (
		<div>
			<h4>Send context</h4>
			<textarea rows={10} value={contextToSend} onChange={(e) => setContextToSend(e.target.value)} />
			<button type="button" onClick={handleClick}>
				Set Context
			</button>
		</div>
	);
}
