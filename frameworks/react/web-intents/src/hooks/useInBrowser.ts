import { useCallback, useEffect, useRef, useState } from "react";
import { Provider } from "../provider/Provider.ts";
import type { PlatformLayoutSnapshot } from "../shapes/layout-shapes.ts";

export function useInBrowser(): {
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
					const provider = new Provider();
					providerRef.current = provider;
					await provider.initializeWorkspacePlatform();
					setLayout(provider.layout);
					setIsInitialized(true);
				}
			} catch (error) {
				console.error(error);
				setError(error.toString());
			}
		};

		void initialize();

		return () => {
			if (providerRef.current) {
				providerRef.current.teardown();
			}
		};
	}, []);

	const changeLayout = useCallback((layoutName: string) => {
		const layoutManager = window.fin?.Platform.Layout.getCurrentLayoutManagerSync();
		if (layoutManager) {
			void layoutManager.showLayout({ layoutName, uuid: fin.me.uuid, name: fin.me.name });
		}
	}, []);

	return { isInitialized, error, layout, changeLayout };
}
