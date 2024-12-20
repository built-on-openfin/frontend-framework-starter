import { init as initBrokerConnection } from "@openfin/core-web/iframe-broker";
import { environment } from "../environments/environment";

/**
 * Initializes the OpenFin Web Broker connection.
 * @returns A promise that resolves when the connection is established.
 */
async function init(): Promise<void> {
	console.log("Initializing OpenFin broker connection");
	return initBrokerConnection({
		sharedWorkerUrl: environment.sharedWorkerUrl,
	});
}

init()
	.then(() => {
		console.log("Connected to the OpenFin IFrame Web Broker.");
		return true;
	})
	.catch((err) => console.error(err));
