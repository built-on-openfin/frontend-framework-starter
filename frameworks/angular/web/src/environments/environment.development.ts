/**
 * Build time config are kept here for simplicity
 * For more flexibility they can be kept in the manifest.json file and loaded at runtime
 */
export const environment = {
	sharedWorkerUrl: "http://localhost:4300/assets/shared-worker.js",
	brokerUrl: "http://localhost:4300/iframe-broker.html",
	layoutUrl: "http://localhost:4200/default.layout.fin.json",
	providerId: "angular-web",
};
