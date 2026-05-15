import "../../App.css";

import { useIntentListener } from "../hooks/use-intent-listener.tsx";
import { useOpenFinWeb } from "../hooks/use-openfin-web.tsx";

/**
 * This app is co-located with the provider app and exposed as a route to demonstrate the intent flow.
 * Ordinarily a view would be a separate web app at any url.
 */
export function ViewQuote() {
	useOpenFinWeb();
	const { context, loading, error } = useIntentListener("ViewQuote");
	const formattedContext = context ? JSON.stringify(context, null, 2) : "";

	return (
		<div className="col gap20" style={{ maxWidth: "720px" }}>
			<header className="col gap10">
				<h1>View Quote</h1>
				<h1 className="tag">Received context for the latest `ViewQuote` intent.</h1>
			</header>

			<div className="col gap10">
				<label className="col gap10" htmlFor="receivedContext">
					<span>Received Context</span>
					<textarea
						id="receivedContext"
						value={formattedContext}
						readOnly
						rows={12}
						spellCheck={false}
						placeholder={loading ? "Waiting for context..." : "No context received yet."}
						className="field field-textarea"
					/>
				</label>

				<div className="col gap10">
					<div>{loading ? "Status: Listening for intent..." : null}</div>
					{error ? <div style={{ color: "var(--brand-error)" }}>{error}</div> : null}
				</div>
			</div>
		</div>
	);
}
