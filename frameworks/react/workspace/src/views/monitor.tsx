import type { Context } from "@finos/fdc3";
import { useEffect, useMemo, useState } from "react";

// Simple mock quote generator
function hash(str: string): number {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
	}
	return Math.abs(h >>> 0);
}

function getMockQuote(ticker: string, horizonValue?: string) {
	const base = hash(ticker) % 500 + 20; // $20 - $520
	// Map horizon to a simple volatility multiplier so the UI "feels" different per selection
	let volMultiplier = 1;
	if (horizonValue) {
		if (horizonValue.includes("1d")) volMultiplier = 0.2;
		else if (horizonValue.includes("1w")) volMultiplier = 0.5;
		else if (horizonValue.includes("1mo")) volMultiplier = 1.0;
		else if (horizonValue.includes("3mo")) volMultiplier = 1.05;
		else if (horizonValue.includes("6mo")) volMultiplier = 1.1;
		else if (horizonValue.includes("1y")) volMultiplier = 1.15;
		else if (horizonValue.includes("5y")) volMultiplier = 1.2;
		else if (horizonValue.includes("10y")) volMultiplier = 1.25;
		else if (horizonValue.includes("20y")) volMultiplier = 1.3;
	}
	const change = (((hash(ticker + "chg") % 2000) - 1000) / 100) * volMultiplier; // -10%..+10% scaled
	const price = Math.max(1, base * (1 + change / 100));
	const prevClose = price / (1 + change / 100);
	return {
		price: Number(price.toFixed(2)),
		changePct: Number(change.toFixed(2)),
		changeAbs: Number((price - prevClose).toFixed(2)),
		volume: (hash(ticker + "vol") % 9_000_000) + 1_000_000,
		dayHigh: Number((price * 1.02).toFixed(2)),
		dayLow: Number((price * 0.98).toFixed(2)),
	};
}

export function Monitor() {

	// Demo state populated from interop contexts
	const [tickers, setTickers] = useState<string[]>([]);
	const [lastContextAt, setLastContextAt] = useState<string | null>(null);
	const [horizonLabel, setHorizonLabel] = useState<string>("—");
	const [horizonValue, setHorizonValue] = useState<string | undefined>(undefined);
	const [horizonTs, setHorizonTs] = useState<string | null>(null);
	const [sessionContextGroup, setSessionContextGroup] = useState<any | null>(null);

	const quotes = useMemo(() => {
		return tickers.map((t) => ({
			ticker: t,
			...getMockQuote(t, horizonValue),
		}));
	}, [tickers, horizonValue]);

	// Outbound: broadcast contexts back to the session group
	const handleBroadcastInstruments = async () => {
		if (!sessionContextGroup) return;
		const list = (tickers.length > 0 ? tickers : ["AAPL", "AMZN", "META"]).map((t) => ({
			type: "instrument",
			id: { ticker: t.toUpperCase() },
		}));
		console.log('Setting instrument context:', list);
		await sessionContextGroup.setContext({
			type: "instrumentList",
			instruments: list,
		});
	};

	const handleSetHorizon = async (label: string, value: string) => {
		if (!sessionContextGroup) return;
		console.log('Setting horizon context:', label, value);
		await sessionContextGroup.setContext({
			type: "streamlit.timeHorizon",
			horizon: label,
			horizonValue: value,
			timestamp: new Date().toISOString(),
		});
	};

	useEffect(() => {
		if (!fin) {
			return;
		}

		(async () => {
			console.log("Listening to session context group");

			const interop = fin.Interop.connectSync(fin.me.uuid, {});
			const contextGroup = await interop.joinSessionContextGroup("stockpeers");
			setSessionContextGroup(contextGroup);
			await contextGroup.addContextHandler((context: Context) => {
				console.log("Received context", context);

				// Handle instrument list
				if (context?.type === "instrumentList") {
					const list = context?.instruments as any[] | undefined;
					const next = (list ?? [])
						.map((i) => i?.id?.ticker as string)
						.filter((t): t is string => Boolean(t))
						.map((t) => t.toUpperCase());
					// de-dup and keep order
					const unique: string[] = [];
					next.forEach((t) => {
						if (!unique.includes(t)) unique.push(t);
					});
					setTickers(unique);
					setLastContextAt(new Date().toISOString());
					return;
				}

				// Handle time horizon
				if (context.type === "streamlit.timeHorizon") {
					const c: Context = context;
					setHorizonLabel(c.horizon ?? "—");
					setHorizonValue(c.horizonValue);
					setHorizonTs(c.timestamp ?? new Date().toISOString());
					return;
				}
			});
		})();
	}, []);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<h2 style={{ margin: 0 }}>Market Monitor</h2>
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					<div
						style={{
							border: "1px solid #e0e0e0",
							borderRadius: 8,
							padding: "6px 10px",
							background: "#fafafa",
						}}
						title={horizonTs ? `Updated ${new Date(horizonTs).toLocaleString()}` : undefined}
					>
						<span style={{ color: "#666", marginRight: 6 }}>Horizon:&nbsp;
						<strong>{horizonLabel}</strong></span>
					</div>
				</div>
			</div>

			<div style={{ fontSize: 12, color: "#666" }}>
				{lastContextAt ? `Last context @ ${new Date(lastContextAt).toLocaleTimeString()}` : "Awaiting context…"}
			</div>

			{/* Outbound controls: send contexts to the session group */}
			<div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
				<button type="button" onClick={handleBroadcastInstruments} disabled={!sessionContextGroup} title={!sessionContextGroup ? "Joining context group…" : undefined}>
					Broadcast instrumentList
				</button>
				<span style={{ color: "#888" }}>|</span>
				<span style={{ color: "#666" }}>Set Horizon:</span>
				<button type="button" onClick={() => handleSetHorizon("1 Month", "1mo")} disabled={!sessionContextGroup}>1M</button>
				<button type="button" onClick={() => handleSetHorizon("3 Months", "3mo")} disabled={!sessionContextGroup}>3M</button>
				<button type="button" onClick={() => handleSetHorizon("6 Months", "6mo")} disabled={!sessionContextGroup}>6M</button>
				<button type="button" onClick={() => handleSetHorizon("1 Year", "1y")} disabled={!sessionContextGroup}>1Y</button>
				<button type="button" onClick={() => handleSetHorizon("5 Years", "5y")} disabled={!sessionContextGroup}>5Y</button>
				<button type="button" onClick={() => handleSetHorizon("10 Years", "10y")} disabled={!sessionContextGroup}>10Y</button>
				<button type="button" onClick={() => handleSetHorizon("20 Years", "20y")} disabled={!sessionContextGroup}>20Y</button>
			</div>

			<div style={{ overflow: "auto", border: "1px solid #eee", borderRadius: 8 }}>
				<table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
					<thead>
						<tr style={{ background: "#f5f7fa" }}>
							<th style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #e5e7eb", color: "#888" }}>Ticker</th>
							<th style={{ textAlign: "right", padding: "8px 12px", borderBottom: "1px solid #e5e7eb", color: "#888" }}>Price</th>
							<th style={{ textAlign: "right", padding: "8px 12px", borderBottom: "1px solid #e5e7eb", color: "#888" }}>Change</th>
							<th style={{ textAlign: "right", padding: "8px 12px", borderBottom: "1px solid #e5e7eb", color: "#888" }}>%</th>
							<th style={{ textAlign: "right", padding: "8px 12px", borderBottom: "1px solid #e5e7eb", color: "#888" }}>Volume</th>
							<th style={{ textAlign: "right", padding: "8px 12px", borderBottom: "1px solid #e5e7eb", color: "#888" }}>Day Range</th>
						</tr>
					</thead>
					<tbody>
						{quotes.length === 0 ? (
							<tr>
								<td colSpan={6} style={{ padding: 16, textAlign: "center", color: "#888" }}>
									Send an `instrumentList` context to populate the blotter
								</td>
							</tr>
						) : (
							quotes.map((q) => {
								const up = q.changePct >= 0;
								const color = up ? "#059669" : "#dc2626";
								return (
									<tr key={q.ticker}>
										<td style={{ padding: "8px 12px", borderBottom: "1px solid #f0f0f0", fontWeight: 600 }}>{q.ticker}</td>
										<td style={{ padding: "8px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>${q.price.toFixed(2)}</td>
										<td style={{ padding: "8px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "right", color }}>{up ? "+" : ""}{q.changeAbs.toFixed(2)}</td>
										<td style={{ padding: "8px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "right", color }}>{up ? "+" : ""}{q.changePct.toFixed(2)}%</td>
										<td style={{ padding: "8px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>{q.volume.toLocaleString()}</td>
										<td style={{ padding: "8px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>
											${q.dayLow.toFixed(2)} – ${q.dayHigh.toFixed(2)}
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
