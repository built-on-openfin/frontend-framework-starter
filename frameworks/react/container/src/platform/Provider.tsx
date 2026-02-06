import React, { useEffect, useState } from "react";
import logo from "../logo.svg";

function Provider() {
	const [message, setMessage] = useState("");

	useEffect(() => {
		(async function () {
			let runtimeAvailable = false;
			if (fin) {
				try {
					await fin.Platform.init({});
					runtimeAvailable = true;
				} catch {}
			}
			if (runtimeAvailable) {
				const runtimeInfo = await fin.System.getRuntimeInfo();
				setMessage(`HERE Runtime: ${runtimeInfo.version}`);
			} else {
				setMessage("HERE runtime is not available");
			}
		})();
	}, []);

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>HERE Core Platform Window</h1>
					<h1 className="tag">Container platform window</h1>
				</div>
				<div className="row middle gap10">
					<img src={logo} alt="HERE" height="40px" />
				</div>
			</header>
			<main className="col gap10">
				<p>This is the platform window, which initializes the platform.</p>
				<p>
					The window would usually be hidden, you can make it hidden on startup by setting the
					platform.autoShow flag to false in the manifest.fin.json
				</p>
				<p>{message}</p>
			</main>
		</div>
	);
}

export default Provider;
