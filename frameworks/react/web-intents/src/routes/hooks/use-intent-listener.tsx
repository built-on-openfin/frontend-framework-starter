/**
 * React hook for registering an FDC3 intent listener and exposing the latest
 * received context together with loading and error state for the subscription.
 */
import { addIntentListener, type Context, type Listener } from "@finos/fdc3";
import { useEffect, useState } from "react";

export function useIntentListener(intentName: string): {
	context: Context | null;
	error: string | null;
	loading: boolean;
} {
	const [context, setContext] = useState<Context | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;
		let listener: Listener | undefined;

		const setupListener = async () => {
			setLoading(true);
			setContext(null);
			setError(null);

			try {
				console.log("Setting up listener for intent:", intentName);

				const registeredListener = await addIntentListener(intentName, (receivedContext: Context) => {
					if (cancelled) {
						return;
					}

					setContext(receivedContext);
					setError(null);
				});

				if (cancelled) {
					registeredListener.unsubscribe();
					return;
				}

				listener = registeredListener;
				setLoading(false);
			} catch (err: unknown) {
				if (cancelled) {
					return;
				}

				setContext(null);
				setLoading(false);
				setError(err instanceof Error ? err.message : String(err));
			}
		};

		const handleFdc3Ready = () => {
			setupListener();
		};

		if (window.fdc3 !== undefined) {
			setupListener();
		} else {
			setLoading(true);
			setContext(null);
			window.addEventListener("fdc3Ready", handleFdc3Ready);
		}

		return () => {
			cancelled = true;
			window.removeEventListener("fdc3Ready", handleFdc3Ready);
			listener?.unsubscribe();
		};
	}, [intentName]);

	return { context, error, loading };
}
