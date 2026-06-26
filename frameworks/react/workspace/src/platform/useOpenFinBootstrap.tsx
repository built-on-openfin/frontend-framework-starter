import { useEffect, useRef, useState } from "react";
import {
	getManifestCustomSettings,
	initializeWorkspaceComponents,
	initializeWorkspacePlatform,
} from "./workspace";

/**
 * Initialize the provider and bootstrap the HERE Core platform
 *
 * @returns True if the provider started successfully.
 */
export function useOpenFinBootstrap() {
	const isInitialized = useRef<boolean>(false);
	const [statusMessage, setStatusMessage] = useState("");

	useEffect(() => {
		(async () => {
			if (!isInitialized.current) {
				isInitialized.current = true;
				try {
					setStatusMessage("Workspace platform initializing");

					// Load the settings from the manifest
					const settings = await getManifestCustomSettings();

					// When the platform api is ready we bootstrap the platform.
					const platform = fin.Platform.getCurrentSync();
					await platform.once("platform-api-ready", async () => {
						await initializeWorkspaceComponents(
							settings.platformSettings,
							settings.customSettings,
							setStatusMessage,
						);
						setStatusMessage("Workspace platform initialized");
					});

					// The DOM is ready so initialize the platform
					// Provide default icons and default theme for the browser windows
					await initializeWorkspacePlatform(settings.platformSettings, setStatusMessage);
				} catch (err) {
					console.log(err);
					setStatusMessage(
						`Error Initializing Platform: ${err instanceof Error ? err.message : err}`,
					);
				}

				isInitialized.current = true;
			}
		})();
	}, []);

	return { statusMessage };
}
