import { fin } from "@openfin/core";
import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';
import * as Notifications from "@openfin/workspace/notifications";

function Provider() {
	const [message, setMessage] = useState("");

	useEffect(() => {
		(async function () {
			let runtimeAvailable = false;
			if (fin) {
				try {
					await fin.Platform.init({});

					await Notifications.register({
						notificationsPlatformOptions: {
							id: fin.me.identity.uuid,
							title: "React Container Starter",
							icon: "http://localhost:3000/favicon.ico"
						}
					});
					runtimeAvailable = true;
				} catch {
				}
			}

			if (runtimeAvailable) {
				const runtimeInfo = await fin.System.getRuntimeInfo();
				setMessage(`OpenFin Runtime: ${runtimeInfo.version}`);
			} else {
				setMessage("OpenFin runtime is not available");
			}
		})();
	}, []);

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>OpenFin Platform Window</h1>
					<h1 className="tag">Container platform window</h1>
				</div>
				<div className="row middle gap10">
					<img src={logo} alt="OpenFin" height="40px" />
				</div>
			</header>
			<main className="col gap10">
				<p>This is the platform window, which initializes the platform.</p>
				<p>The window would usually be hidden, you can make it hidden on startup by setting the platform.autoShow flag to false in the manifest.fin.json</p>
				<p>{message}</p>
			</main>
		</div>
	);
}

export default Provider;
