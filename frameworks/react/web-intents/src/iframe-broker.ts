import { init as initBrokerConnection } from "@openfin/core-web/iframe-broker";

/**
 * Initializes the OpenFin Web Broker connection.
 * @returns A promise that resolves when the connection is established.
 */
async function init(): Promise<void> {
	return initBrokerConnection({
		sharedWorkerUrl: `${window.location.origin}/assets/shared-worker.js`,
	});
}

init()
	.then(() => {
		console.log("Connected to the OpenFin IFrame Web Broker.");
		return true;
	})
	.catch((err) => console.error(err));
