import { type Channel, type Context, type DesktopAgent, type Listener } from "@finos/fdc3";
import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from "react";

const CONTEXT_TYPE = "workspace.platformState";

export function usePlatformState<T>(
	topic: string,
	defaultState?: T,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
	const [currentValue, setCurrentValue] = useState<T | undefined>(defaultState);
	const channelRef = useRef<Channel | null>(null);
	const listenerRef = useRef<Listener | null>(null);
	const mountedRef = useRef(true); // Flag to avoid state updates after unmount
	const fcd3: DesktopAgent = window.fdc3;

	const setValue = useCallback(async (payload: T | ((prevValue: T | undefined) => T | undefined)) => {
		setCurrentValue((prev) => {
			const newValue =
				typeof payload === "function"
					? (payload as (p: T | undefined) => T | undefined)(prev)
					: (payload as T | undefined);
			if (channelRef.current) {
				const context: Context = { type: CONTEXT_TYPE, payload: newValue };
				channelRef.current.broadcast(context).catch((err) => {
					console.error("Failed to broadcast platform state context:", err);
				});
			}
			return newValue;
		});
	}, []);

	useEffect(() => {
		if (!window.fdc3) {
			console.warn("FDC3 is not available");
			return () => {};
		}
		console.info(`Creating channel ${topic}`);

		const initChannel = async () => window.fdc3.getOrCreateChannel(topic);

		const getChannelValue = async (channel: Channel) => {
			try {
				const current = await channel.getCurrentContext();
				if (current && current.payload !== undefined) {
					if (mountedRef.current) {
						setCurrentValue(current.payload as T | undefined);
					}
				}
			} catch (err) {
				console.error("Failed to get current context for platform state:", err);
			}
		};

		const listenOnChannel = async (channel: Channel) => {
			if (!listenerRef.current) {
				listenerRef.current = await channel.addContextListener(CONTEXT_TYPE, (context) => {
					console.info(`Received context on channel ${topic}`, context);
					if (mountedRef.current) {
						setCurrentValue(context.payload as T | undefined);
					}
				});
			}
		};

		(async () => {
			channelRef.current = await initChannel();
			await getChannelValue(channelRef.current);
			await listenOnChannel(channelRef.current);
		})().catch((error: Error | string) => {
			console.error(error.toString());
		});

		return () => {
			mountedRef.current = false;
			if (listenerRef.current) {
				try {
					listenerRef.current.unsubscribe();
				} catch {
					// ignore unsubscribe errors
				}
				listenerRef.current = null;
			}
		};
	}, [topic, fcd3]);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	return [currentValue, setValue];
}
