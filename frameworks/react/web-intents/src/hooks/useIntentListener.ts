import {
	addIntentListener,
	type Context,
	type ContextMetadata,
	type IntentHandler,
	type Listener,
} from "@finos/fdc3";
import { useCallback, useEffect, useRef, useState } from "react";

export function useIntentListener(
	intentName: string,
	handler?: IntentHandler,
): {
	context: Context | null;
	error: Error | null;
} {
	const [context, setContext] = useState<Context | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const listenerRef = useRef<Listener | null>(null);

	const setupListeners = useCallback(async () => {
		listenerRef.current = await addIntentListener(
			intentName,
			(result: Context, metadata?: ContextMetadata) => {
				setContext(result);
				setError(null);
				if (handler) {
					void handler(result, metadata);
				}
			},
		).catch((error: Error) => {
			setContext(null);
			setError(error);
			return null;
		});
	}, [handler, intentName]);

	const init = useCallback(async () => {
		if (window.fdc3 !== undefined) {
			await setupListeners();
		} else {
			window.addEventListener("fdc3Ready", () => void setupListeners());
		}
	}, [setupListeners]);

	useEffect(() => {
		void init();
		return () => {
			listenerRef.current?.unsubscribe();
		};
	}, [init, intentName]);

	return { context, error };
}
