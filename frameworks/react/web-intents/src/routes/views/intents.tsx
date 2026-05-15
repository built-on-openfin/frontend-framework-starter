import "../../App.css";

import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import type { Context } from "@finos/fdc3";
import { useOpenFinWeb } from "../hooks/use-openfin-web.tsx";
import { useRaiseIntent } from "../hooks/use-raise-intent";

type IntentOption = {
	label: string;
	value: string;
	defaultContextType: string;
	defaultContextBody: string;
};

const INTENT_OPTIONS: IntentOption[] = [
	{
		label: "View Contact",
		value: "ViewContact",
		defaultContextType: "fdc3.contact",
		defaultContextBody: JSON.stringify(
			{
				name: "Andy Young",
				id: {
					email: "andy.young@example.com",
				},
			},
			null,
			2,
		),
	},
	{
		label: "View Quote",
		value: "ViewQuote",
		defaultContextType: "custom.instrument",
		defaultContextBody: JSON.stringify(
			{
				name: "AAPL",
				id: {
					ticker: "AAPL",
				},
			},
			null,
			2,
		),
	},
];

function buildInitialState(option: IntentOption) {
	return {
		intentName: option.value,
		contextType: option.defaultContextType,
		contextBody: option.defaultContextBody,
	};
}

function parseContextBody(contextBody: string): Record<string, unknown> | undefined {
	const parsed: unknown = JSON.parse(contextBody);
	if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object") {
		return undefined;
	}

	return parsed as Record<string, unknown>;
}

export function Intents() {
	useOpenFinWeb();
	const raiseIntent = useRaiseIntent();
	const [formState, setFormState] = useState(() => buildInitialState(INTENT_OPTIONS[0]));

	const selectedOption = useMemo(
		() => INTENT_OPTIONS.find((option) => option.value === formState.intentName) ?? INTENT_OPTIONS[0],
		[formState.intentName],
	);

	const parsedContextError = useMemo(() => {
		if (!formState.contextBody.trim()) {
			return "Context is required.";
		}

		try {
			const parsedContext = parseContextBody(formState.contextBody);
			if (!parsedContext) {
				return "Context must be a JSON object.";
			}
			return undefined;
		} catch {
			return "Context must be valid JSON.";
		}
	}, [formState.contextBody]);

	const handleIntentChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
		const nextOption =
			INTENT_OPTIONS.find((option) => option.value === event.target.value) ?? INTENT_OPTIONS[0];

		setFormState(buildInitialState(nextOption));
	}, []);

	const handleContextTypeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setFormState((current) => ({
			...current,
			contextType: event.target.value,
		}));
	}, []);

	const handleContextBodyChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
		setFormState((current) => ({
			...current,
			contextBody: event.target.value,
		}));
	}, []);

	const handleSubmit = useCallback(() => {
		if (parsedContextError) {
			return;
		}

		const parsedContext = parseContextBody(formState.contextBody);
		if (!parsedContext) {
			return;
		}

		void raiseIntent(formState.intentName, {
			...(parsedContext as Omit<Context, "type">),
			type: formState.contextType.trim(),
		});
	}, [formState.contextBody, formState.contextType, formState.intentName, parsedContextError, raiseIntent]);

	const isSubmitDisabled = !formState.contextType.trim() || parsedContextError !== undefined;

	return (
		<div className="col gap20" style={{ maxWidth: "720px" }}>
			<header className="col gap10">
				<h1>Raise Intent</h1>
				<h1 className="tag">Select an intent and send a context payload.</h1>
			</header>

			<div className="col gap10">
				<label className="col gap10" htmlFor="intentName">
					<span>Intent</span>
					<select
						id="intentName"
						value={formState.intentName}
						onChange={handleIntentChange}
						className="field"
					>
						{INTENT_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</label>

				<label className="col gap10" htmlFor="contextType">
					<span>Context Type</span>
					<input
						id="contextType"
						type="text"
						value={formState.contextType}
						onChange={handleContextTypeChange}
						placeholder={selectedOption.defaultContextType}
						className="field"
					/>
				</label>

				<label className="col gap10" htmlFor="contextBody">
					<span>Context</span>
					<textarea
						id="contextBody"
						value={formState.contextBody}
						onChange={handleContextBodyChange}
						rows={12}
						spellCheck={false}
						className="field field-textarea"
					/>
				</label>

				{parsedContextError ? (
					<div style={{ color: "var(--brand-error)" }}>{parsedContextError}</div>
				) : null}

				<div>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isSubmitDisabled}
						className="button-primary"
					>
						Raise Intent
					</button>
				</div>
			</div>
		</div>
	);
}
