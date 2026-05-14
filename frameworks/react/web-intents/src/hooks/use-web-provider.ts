import { useEffect, useState } from "react";
import { init } from "../provider";

export function useWebProvider() {
	const [fin, setFin] = useState<Awaited<ReturnType<typeof init>> | undefined>(undefined);

	useEffect(() => {
		let isMounted = true;
		void init()
			.then((createdFin) => {
				if (!isMounted) return;
				setFin(createdFin);
				if (createdFin) {
					console.log("Created the OpenFin Web Layout.");
				}
			})
			.catch((err: unknown) => {
				if (!isMounted) return;
				console.error(err);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	return { fin };
}
