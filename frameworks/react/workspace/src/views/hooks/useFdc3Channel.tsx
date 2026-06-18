import { type Context, type Listener } from "@finos/fdc3";
import { useCallback, useEffect, useRef } from "react";

interface UseFdc3ChannelOptions {
	/** The name of the FDC3 app channel. */
	channelName: string;
	/** Context type to listen for. When omitted, all context types are received. */
	contextType?: string;
	/** Handler invoked when a context is received on the channel. When omitted, no listener is registered. */
	onContext?: (context: Context) => void;
}

/**
 * Demonstrates the use of a specific FDC3 app channel.
 *
 * @param options Channel configuration and optional listener.
 * @returns A `broadcast` function for publishing context on the channel.
 */
export function useFdc3Channel(options: UseFdc3ChannelOptions) {
	const listenerRef = useRef<Listener | null>(null);
	const { channelName, contextType, onContext } = options;

	useEffect(() => {
		if (!onContext) {
			return;
		}
		if (!window.fdc3) {
			console.error("FDC3 is not available");
			return;
		}

		let active = true;

		(async () => {
			const channel = await window.fdc3.getOrCreateChannel(channelName);
			const listener = await channel.addContextListener(contextType ?? null, (context) => {
				console.log(`useFdc3Channel: received context on ${channelName}`, context);
				onContext(context);
			});
			if (active) {
				listenerRef.current = listener;
			} else {
				listener.unsubscribe();
			}
		})().catch((err) => {
			console.error("useFdc3Channel: failed to register listener", err);
		});

		return () => {
			active = false;
			listenerRef.current?.unsubscribe();
			listenerRef.current = null;
		};
	}, [channelName, contextType, onContext]);

	const broadcast = useCallback(
		(context: Context) => {
			console.log(`useFdc3Channel: broadcasting context on ${channelName}`, context);
			window.fdc3
				?.getOrCreateChannel(channelName)
				.then((channel) => channel.broadcast(context))
				.catch((err) => {
					console.error(`useFdc3Channel: failed to broadcast context on ${channelName}`, err);
				});
		},
		[channelName],
	);

	return { broadcast };
}
