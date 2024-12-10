import { useEffect, useState } from "react";
import { getApps } from "../provider/apps/apps.ts";
import { type PlatformApp } from "../shapes/app-shapes.ts";

export function useApps(): {
	apps: PlatformApp[];
	error: string | null;
} {
	const [apps, setApps] = useState<PlatformApp[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadApps = async () => {
			try {
				const applications = await getApps();
				setApps(applications);
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

	return { apps, error };
}
