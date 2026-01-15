import React, { useEffect, useState } from "react";
import logo from "../logo.svg";

function View2() {
	const [message, setMessage] = useState("");

	useEffect(() => {
		async function listenForFDC3Context() {
			if (window.fdc3) {
				console.log("Listen for FDC3 User Context");
				await fdc3.addContextListener(null, (context) => {
					setMessage(JSON.stringify(context, undefined, "  "));
				});
			} else {
				window.addEventListener("fdc3Ready", listenForFDC3Context);
			}
		}

		async function listenForFDC3ContextAppChannel() {
			if (window.fdc3) {
				const appChannel = await fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");
				console.log("Listen for FDC3 App Context");
				await appChannel.addContextListener(null, (context) => {
					setMessage(JSON.stringify(context, undefined, "  "));
				});
			} else {
				window.addEventListener("fdc3Ready", listenForFDC3ContextAppChannel);
			}
		}
		(async function () {
			console.log("View2 mounted");
			await listenForFDC3Context();
			await listenForFDC3ContextAppChannel();
		})();
	}, []);

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>HERE React View 2</h1>
					<h1 className="tag">React app view in an HERE container</h1>
				</div>
				<div className="row middle gap10">
					<img src={logo} alt="HERE" height="40px" />
				</div>
			</header>
			<main className="col gap10 left width-full">
				<fieldset className="width-full">
					<label htmlFor="message">Context Received</label>
					<pre id="message" className="width-full" style={{ minHeight: "110px" }}>
						{message}
					</pre>
				</fieldset>
				<button onClick={() => setMessage("")}>Clear</button>
			</main>
		</div>
	);
}

export default View2;
