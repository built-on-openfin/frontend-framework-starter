import { useEffect, useRef, useState } from "react";
import { Provider } from "../provider/Provider.ts";

export function useInBrowser(): {
	isInitialized: boolean;
	error: string | null;
} {
	const [isInitialized, setIsInitialized] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const providerRef = useRef<Provider | null>(null);

	useEffect(() => {
		const initialize = async () => {
			try {
				if (providerRef.current === null) {
					const provider = new Provider();
					await provider.initializeWorkspacePlatform();
					providerRef.current = provider;
					setIsInitialized(true);
				}
			} catch (error) {
				console.error(error);
				setError(error.toString());
			}
		};

		initialize();

		return () => {
			if (providerRef.current) {
				providerRef.current.teardown();
			}
		};
	}, []);

	return { isInitialized, error };
}
