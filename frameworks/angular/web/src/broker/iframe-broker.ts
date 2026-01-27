import { init as initBrokerConnection } from "@openfin/core-web/iframe-broker";
import { environment } from "../environments/environment";

/**
 * Initializes the HERE Web Broker connection.
 * @returns A promise that resolves when the connection is established.
 */
async function init(): Promise<void> {
	console.log("Initializing HERE broker connection");
	return initBrokerConnection({
		sharedWorkerUrl: environment.sharedWorkerUrl,
		logLevel: "info",
	});
}

init()
	.then(() => {
		console.log("Connected to the HERE IFrame Web Broker.");
		return true;
	})
	.catch((err) => console.error(err));
