import React from "react";
import logo from "../logo.svg";

function View1() {
	async function broadcastFDC3Context() {
		if (window.fdc3) {
			await fdc3.broadcast({
				type: "fdc3.instrument",
				name: "Microsoft Corporation",
				id: {
					ticker: "MSFT",
				},
			});
		} else {
			console.error("FDC3 is not available");
		}
	}

	async function broadcastFDC3ContextAppChannel() {
		if (window.fdc3) {
			const appChannel = await fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");

			await appChannel.broadcast({
				type: "fdc3.instrument",
				name: "Apple Inc.",
				id: {
					ticker: "AAPL",
				},
			});
		} else {
			console.error("FDC3 is not available");
		}
	}

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>HERE React View 1</h1>
					<h1 className="tag">React app view in an HERE container</h1>
				</div>
				<div className="row middle gap10">
					<img src={logo} alt="HERE" height="40px" />
				</div>
			</header>
			<main className="col gap10 left">
				<button onClick={() => broadcastFDC3Context()}>Broadcast FDC3 User Context</button>
				<button onClick={() => broadcastFDC3ContextAppChannel()}>Broadcast FDC3 App Context</button>
			</main>
		</div>
	);
}

export default View1;
