import { useEffect, useState } from "react";
import { getSettings } from "../provider/settings/settings.ts";
import { type Settings } from "../shapes/setting-shapes.ts";

export function useSettings(): {
	settings: Settings | null;
	error: string | null;
} {
	const [settings, setSettings] = useState<Settings | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadApps = async () => {
			try {
				const appSettings = await getSettings();
				setSettings(appSettings ?? null);
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

		void loadApps();
	}, []);

	return { settings, error };
}
