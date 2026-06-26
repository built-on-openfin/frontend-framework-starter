import { useCallback, useState } from "react";
import { type Context } from "@finos/fdc3";
import { useFdc3Context } from "./hooks/useFdc3Context";
import { useFdc3Channel } from "./hooks/useFdc3Channel";

const CUSTOM_APP_CHANNEL = "CUSTOM-APP-CHANNEL";

export function View2() {
	const [message, setMessage] = useState<string>("");

	const handleContext = useCallback((context: Context) => {
		setMessage(JSON.stringify(context, undefined, "  "));
	}, []);

	useFdc3Context({ contextType: "fdc3.instrument", onContext: handleContext });
	useFdc3Channel({
		channelName: CUSTOM_APP_CHANNEL,
		contextType: "fdc3.instrument",
		onContext: handleContext,
	});

	const clearMessage = () => {
		setMessage("");
	};

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>HERE React View 2</h1>
					<h1 className="tag">React app view in an HERE workspace</h1>
				</div>
				<div className="row middle gap10">
					<img src="logo.svg" alt="HERE" height="40px" />
				</div>
			</header>
			<main className="col gap10 left width-full">
				{message && (
					<>
						<fieldset className="width-full">
							<label htmlFor="message">Context Received</label>
							<pre id="message" className="width-full" style={{ minHeight: "110px" }}>
								{message}
							</pre>
						</fieldset>
						<button type="button" onClick={clearMessage}>
							Clear
						</button>
					</>
				)}
			</main>
		</div>
	);
}
