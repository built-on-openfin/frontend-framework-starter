import { useCallback, useEffect, useRef, useState } from "react";
import { type OpenFin } from "@openfin/core";

export function useAppContext(channelName: string): {
	setContext: (ctx: OpenFin.Context) => void;
	context: OpenFin.Context | null;
} {
	const [currentContext, setCurrentContext] = useState<OpenFin.Context | null>(null);
	const channel = useRef<OpenFin.SessionContextGroup | null>(null);
	const unsubscribe = useRef<Promise<{ unsubscribe: () => void }>>(undefined);

	const setContext = useCallback(async (context: OpenFin.Context) => {
		if (channel.current) {
			await channel.current.setContext(context);
		}
	}, []);

	useEffect(() => {
		if (!fin) {
			console.error("OpenFin API is not available");
		}
		const subscribeToAppChannel = async () => {
			channel.current = await fin.me.interop.joinSessionContextGroup(channelName);
			unsubscribe.current = channel.current?.addContextHandler((context) => {
				console.log("Context received", context);
				setCurrentContext(context);
			});
		};
		void subscribeToAppChannel();

		return () => {
			unsubscribe.current?.then((result) => result?.unsubscribe());
		};
	}, []);

	return { setContext, context: currentContext };
}
