import { type Context, type Listener } from "@finos/fdc3";
import { useCallback, useEffect, useRef } from "react";

interface UseFdc3ContextOptions {
	/** Context type to listen for. When omitted, all context types are received. */
	contextType?: string;
	/** Handler invoked when a context is received. When omitted, no listener is registered. */
	onContext?: (context: Context) => void;
}

/**
 * Demonstrates a general FDC3 broadcast of context over the current context group.
 *
 * @param options Optional listener configuration.
 * @returns A `broadcast` function for publishing context.
 */
export function useFdc3Context(options?: UseFdc3ContextOptions) {
	const listenerRef = useRef<Listener | null>(null);
	const onContext = options?.onContext;
	const contextType = options?.contextType;

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
			const listener = await window.fdc3.addContextListener(contextType ?? null, (context) => {
				console.log("useFdc3Context: received context", context);
				onContext(context);
			});
			if (active) {
				listenerRef.current = listener;
			} else {
				listener.unsubscribe();
			}
		})().catch((err) => {
			console.error("useFdc3Context: failed to register listener", err);
		});

		return () => {
			active = false;
			listenerRef.current?.unsubscribe();
			listenerRef.current = null;
		};
	}, [contextType, onContext]);

	const broadcast = useCallback((context: Context) => {
		console.log("useFdc3Context: broadcasting context", context);
		window.fdc3?.broadcast(context).catch((err) => {
			console.error("useFdc3Context: failed to broadcast context", err);
		});
	}, []);

	return { broadcast };
}
