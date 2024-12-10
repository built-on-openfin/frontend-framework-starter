import { useCallback, useEffect, useRef, useState } from "react";
import { Provider } from "../provider/Provider.ts";
import { type PlatformApp } from "../shapes/app-shapes.ts";
import type { PlatformLayoutSnapshot } from "../shapes/layout-shapes.ts";
import { type Settings } from "../shapes/setting-shapes.ts";

export type UseInBrowserProps = {
	apps: PlatformApp[];
	settings: Settings | null;
};

export function useInBrowser({ apps, settings }: UseInBrowserProps): {
	isInitialized: boolean;
	error: string | null;
	layout: PlatformLayoutSnapshot | null;
	changeLayout: (layoutName: string) => void;
} {
	const [isInitialized, setIsInitialized] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [layout, setLayout] = useState<PlatformLayoutSnapshot | null>(null);

	const providerRef = useRef<Provider | null>(null);

	useEffect(() => {
		const initialize = async () => {
			try {
				if (providerRef.current === null) {
					console.log("Creating new Provider");
					const provider = new Provider(apps, settings!);
					providerRef.current = provider;
					await provider.initializeWorkspacePlatform();
					setLayout(provider.layout);
					setIsInitialized(true);
				} else {
					providerRef.current.updateApps(apps);
				}
			} catch (error) {
				if (error instanceof Error) {
					console.error(error);
					setError(error.message);
				} else {
					console.error("Unknown error:", error);
					setError("An unknown error occurred.");
				}
			}
		};

		if (apps && settings) {
			void initialize();
		}

		// FIXME: Why is this being over-run?
		// return () => {
		// 	if (providerRef.current) {
		// 		console.log("Teardown useInBrowser");
		// 		providerRef.current.teardown();
		// 		providerRef.current = null;
		// 	}
		// };
	}, [apps, settings]);

	const changeLayout = useCallback((layoutName: string) => {
		const layoutManager = window.fin?.Platform.Layout.getCurrentLayoutManagerSync();
		if (layoutManager) {
			void layoutManager.showLayout({ layoutName, uuid: fin.me.uuid, name: fin.me.name });
		}
	}, []);

	return { isInitialized, error, layout, changeLayout };
}
