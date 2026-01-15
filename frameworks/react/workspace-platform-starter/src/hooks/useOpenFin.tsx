import { useEffect, useRef } from "react";
import { init as bootstrap } from "workspace-platform-starter/bootstrapper";
import { createLogger } from "workspace-platform-starter/logger-provider";
import { init as initializePlatform } from "workspace-platform-starter/platform/platform";
import * as platformSplashProvider from "workspace-platform-starter/platform/platform-splash";

/**
 * Initialize the provider and bootstrap the HERE Core platform
 *
 * @returns True if the provider started successfully.
 */
async function init(): Promise<boolean> {
	await platformSplashProvider.open();

	try {
		return await new Promise<boolean>((resolve, reject) => {
			const logger = createLogger("Provider");
			// Get a reference to the platform proxy and add an event listener
			// to bootstrap the application once the platform is ready.
			const platform = fin.Platform.getCurrentSync();

			platform
				.once("platform-api-ready", () => {
					logger.info("Platform API Ready event received.");
					bootstrap()
						.then((success) => {
							logger.info("Bootstrap return success:", success);
							logger.info("Listener for Platform API Ready event setup.");
							resolve(success);
							return success;
						})
						.catch((failure) => {
							logger.error("Failed bootstrap execution for the following reason:", failure);
							resolve(false);
						});
				})
				.catch(async (reason) => {
					logger.error("Listener for Platform API Ready event had a problem being setup:", reason);
					resolve(false);
				});

			// initialize the platform to prepare the application and trigger the bootstrapping
			// process once the platform is ready.
			initializePlatform()
				.then((success) => {
					logger.info("Platform Initialized with success:", success);
					if (!success) {
						resolve(success);
					}
					return success;
				})
				.catch((failure) => {
					logger.error("Error encountered when trying to initiate platform:", failure);
					reject(failure);
				});
		});
	} finally {
		await platformSplashProvider.close();
	}
}

export function useOpenFin() {
	const isInitialized = useRef<boolean>(false);

	useEffect(() => {
		if (!isInitialized.current) {
			init();
			isInitialized.current = true;
		}
	}, []);
}
