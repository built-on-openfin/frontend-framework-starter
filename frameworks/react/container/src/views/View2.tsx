import "@finos/fdc3";
import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';

function View2() {
	const [message, setMessage] = useState("");

	useEffect(() => {
		(async function () {
			await listenForFDC3Context();
			await listenForFDC3ContextAppChannel();
		})();
	}, []);

	async function listenForFDC3Context() {
		if (window.fdc3) {
			await window.fdc3.addContextListener((context) => {
				setMessage(JSON.stringify(context, undefined, "  "));
			});
		} else {
			console.error("FDC3 is not available");
		}
	}	

	async function listenForFDC3ContextAppChannel() {
		if (window.fdc3) {
			const appChannel = await window.fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");

			await appChannel.addContextListener((context) => {
				setMessage(JSON.stringify(context, undefined, "  "));
			});
		} else {
			console.error("FDC3 is not available");
		}
	}	

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>OpenFin React View 2</h1>
					<h1 className="tag">React app view in an OpenFin container</h1>
				</div>
				<div className="row middle gap10">
					<img src={logo} alt="OpenFin" height="40px" />
				</div>
			</header>
			<main className="col gap10 left width-full">
				<fieldset className="width-full">
					<label htmlFor="message">Context Received</label>
					<pre id="message" className="width-full" style={{minHeight:"110px"}}>{message}</pre>
				</fieldset>
				<button onClick={() => setMessage("")}>Clear</button>
			</main>
		</div>
	);
}

export default View2;
