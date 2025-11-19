import type { Context } from "@finos/fdc3";
import { type ChangeEvent, type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { InstrumentContext } from "./fx/fx-helpers";

export function Ticket() {
	useEffect(() => {
		document.title = "FX Trade Ticket";
	}, []);

	const [now, setNow] = useState("");
	useEffect(() => {
		const t = setInterval(() => {
			setNow(
				new Date().toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				}),
			);
		}, 1000);
		return () => clearInterval(t);
	}, []);

	const [form, setForm] = useState({
		pair: "",
		side: "BUY" as "BUY" | "SELL",
		dealtCcy: "BASE" as "BASE" | "TERMS",
		notional: "",
		rate: "",
		ssi: "",
		counterparty: "",
		book: "",
		trader: "",
		salesperson: "",
		externalId: "",
		comment: "",
		tif: "DAY" as "DAY" | "GTC" | "IOC" | "FOK",
	});

	// Derived display helpers
	const [base, terms] = useMemo((): [string, string] => {
		if (!form.pair.includes("/")) {
			return ["", ""];
		}
		const parts = form.pair.split("/");
		return [parts[0] ?? "", parts[1] ?? ""];
	}, [form.pair]);
	const notionalCcy = form.dealtCcy === "BASE" ? base : terms;
	const dp = useMemo(() => (/\/JPY$/.test(form.pair) ? 3 : 5), [form.pair]);

	const setField = useCallback(
		(name: keyof typeof form, value: string) => setForm((p) => ({ ...p, [name]: value })),
		[],
	);
	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setField(name as keyof typeof form, value);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		console.log("FX Spot order submitted", form);
		alert("FX Spot order submitted (demo)");
	};

	// FDC3 intent listeners (prefer CreateOrder; fall back to ViewInstrument for compatibility)
	useEffect(() => {
		const bind = (intent: string) =>
			window.fdc3?.addIntentListener(intent, (context: Context) => {
				const c = context as InstrumentContext;
				// Prefill from InstrumentContext: name -> pair, use mid if present for rate
				if (c?.name) setField("pair", c.name);
				if (c?.mid != null) setField("rate", String(c.mid));
				// Optionally set LP as counterparty if provided
				if (c?.lp) setField("counterparty", String(c.lp));
			});

		const removeCreate = bind("CreateOrder");
		const removeView = bind("ViewInstrument");

		const tryUnsubscribe = (ret: unknown) => {
			try {
				if (typeof ret === "function") {
					(ret as () => void)();
					return;
				}
				if (ret && typeof ret === "object") {
					const maybe = ret as { unsubscribe?: () => void };
					maybe.unsubscribe?.();
				}
			} catch {
				// ignore
			}
		};

		return () => {
			// Some FDC3 impls return an unsubscribe; be defensive
			tryUnsubscribe(removeCreate);
			tryUnsubscribe(removeView);
		};
	}, [setField]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			{/* Header */}
			<header className="h-12 flex items-center justify-between px-4 bg-slate-900 text-white shadow border-b border-slate-800">
				<div className="flex items-center gap-3">
					<div className="w-1 h-6 bg-blue-500 rounded-full" />
					<h1 className="text-sm font-semibold tracking-wide">FX Trade Ticket</h1>
					{form.pair && <span className="text-xs text-slate-300">{form.pair}</span>}
				</div>
				<div className="text-xs text-slate-300">{now}</div>
			</header>

			{/* Main Content */}
			<main className="max-w-4xl mx-auto p-4">
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Top row: Pair, Side, Dealt Ccy */}
					<section className="bg-white rounded-md shadow-sm border border-slate-200 p-3">
						<div className="grid grid-cols-12 gap-3 items-end">
							<div className="col-span-5">
								<label
									htmlFor="pair"
									className="block text-[10px] font-semibold text-slate-600 uppercase mb-1"
								>
									Pair
								</label>
								<input
									id="pair"
									name="pair"
									value={form.pair}
									onChange={handleChange}
									placeholder="EUR/USD"
									className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm font-mono"
								/>
							</div>
							<div className="col-span-3">
								<div className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
									Side
								</div>
								<div className="grid grid-cols-2 gap-2">
									<button
										type="button"
										onClick={() => setField("side", "BUY")}
										className={`py-1.5 rounded text-xs font-semibold ${
											form.side === "BUY"
												? "bg-emerald-600 text-white"
												: "bg-slate-100 text-slate-700"
										}`}
									>
										BUY
									</button>
									<button
										type="button"
										onClick={() => setField("side", "SELL")}
										className={`py-1.5 rounded text-xs font-semibold ${
											form.side === "SELL"
												? "bg-rose-600 text-white"
												: "bg-slate-100 text-slate-700"
										}`}
									>
										SELL
									</button>
								</div>
							</div>
							<div className="col-span-4">
								<div className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
									Dealt Currency
								</div>
								<div className="grid grid-cols-2 gap-2">
									<button
										type="button"
										onClick={() => setField("dealtCcy", "BASE")}
										className={`py-1.5 rounded text-xs font-semibold ${
											form.dealtCcy === "BASE"
												? "bg-slate-800 text-white"
												: "bg-slate-100 text-slate-700"
										}`}
									>
										Base {base && `(${base})`}
									</button>
									<button
										type="button"
										onClick={() => setField("dealtCcy", "TERMS")}
										className={`py-1.5 rounded text-xs font-semibold ${
											form.dealtCcy === "TERMS"
												? "bg-slate-800 text-white"
												: "bg-slate-100 text-slate-700"
										}`}
									>
										Terms {terms && `(${terms})`}
									</button>
								</div>
							</div>
						</div>
					</section>

					{/* Middle row: Notional, Rate, Value Date (Spot) */}
					<section className="bg-white rounded-md shadow-sm border border-slate-200 p-3">
						<div className="grid grid-cols-12 gap-3 items-end">
							<div className="col-span-5">
								<label
									htmlFor="notional"
									className="block text-[10px] font-semibold text-slate-600 uppercase mb-1"
								>
									Notional {notionalCcy && `(${notionalCcy})`}
								</label>
								<input
									id="notional"
									name="notional"
									value={form.notional}
									onChange={handleChange}
									placeholder="10,000,000"
									className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm font-mono"
								/>
							</div>
							<div className="col-span-4">
								<label
									htmlFor="rate"
									className="block text-[10px] font-semibold text-slate-600 uppercase mb-1"
								>
									Rate
								</label>
								<input
									id="rate"
									name="rate"
									value={form.rate}
									onChange={handleChange}
									placeholder={dp === 3 ? "0.123" : "1.12345"}
									className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm font-mono"
								/>
							</div>
							<div className="col-span-3">
								<div className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
									Value Date
								</div>
								<div className="px-2 py-1.5 border border-slate-200 rounded bg-slate-50 text-xs">
									Spot
								</div>
							</div>
						</div>
					</section>

					{/* Lower row: SSI, Counterparty, Book, Trader, Salesperson */}
					<section className="bg-white rounded-md shadow-sm border border-slate-200 p-3">
						<div className="grid grid-cols-12 gap-3 items-end">
							<div className="col-span-3">
								<label
									htmlFor="ssi"
									className="block text-[10px] font-semibold text-slate-600 uppercase mb-1"
								>
									Settlement Instructions (SSI)
								</label>
								<select
									id="ssi"
									name="ssi"
									value={form.ssi}
									onChange={handleChange}
									className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
								>
									<option value="">Select...</option>
									<option value="STD-CORP-USD">STD-CORP-USD</option>
									<option value="STD-CORP-EUR">STD-CORP-EUR</option>
									<option value="PRIME-1">PRIME-1</option>
								</select>
							</div>
							<div className="col-span-3">
								<label
									htmlFor="counterparty"
									className="block text-[10px] font-semibold text-slate-600 uppercase mb-1"
								>
									Counterparty
								</label>
								<input
									id="counterparty"
									name="counterparty"
									value={form.counterparty}
									onChange={handleChange}
									placeholder="e.g. Citi"
									className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
								/>
							</div>
							<div className="col-span-2">
								<label
									htmlFor="book"
									className="block text-[10px] font-semibold text-slate-600 uppercase mb-1"
								>
									Book
								</label>
								<select
									id="book"
									name="book"
									value={form.book}
									onChange={handleChange}
									className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
								>
									<option value="">Select...</option>
									<option value="FX-SPOT-NYC">FX-SPOT-NYC</option>
									<option value="FX-SPOT-LDN">FX-SPOT-LDN</option>
								</select>
							</div>
							<div className="col-span-2">
								<label
									htmlFor="trader"
									className="block text-[10px] font-semibold text-slate-600 uppercase mb-1"
								>
									Trader
								</label>
								<select
									id="trader"
									name="trader"
									value={form.trader}
									onChange={handleChange}
									className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
								>
									<option value="">Select...</option>
									<option value="A.User">A.User</option>
									<option value="B.Trader">B.Trader</option>
								</select>
							</div>
							<div className="col-span-2">
								<label
									htmlFor="salesperson"
									className="block text-[10px] font-semibold text-slate-600 uppercase mb-1"
								>
									Salesperson (optional)
								</label>
								<input
									id="salesperson"
									name="salesperson"
									value={form.salesperson}
									onChange={handleChange}
									placeholder="e.g. S.Smith"
									className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
								/>
							</div>
						</div>
					</section>

					{/* Footer: TIF, External ID, Comment, Actions */}
					<section className="bg-white rounded-md shadow-sm border border-slate-200 p-3">
						<div className="grid grid-cols-12 gap-3 items-end">
							<div className="col-span-2">
								<label
									htmlFor="tif"
									className="block text-[10px] font-semibold text-slate-600 uppercase mb-1"
								>
									Time in Force
								</label>
								<select
									id="tif"
									name="tif"
									value={form.tif}
									onChange={handleChange}
									className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
								>
									<option value="DAY">DAY</option>
									<option value="GTC">GTC</option>
									<option value="IOC">IOC</option>
									<option value="FOK">FOK</option>
								</select>
							</div>
							<div className="col-span-3">
								<label
									htmlFor="externalId"
									className="block text-[10px] font-semibold text-slate-600 uppercase mb-1"
								>
									External ID (optional)
								</label>
								<input
									id="externalId"
									name="externalId"
									value={form.externalId}
									onChange={handleChange}
									placeholder="ClientRef123"
									className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
								/>
							</div>
							<div className="col-span-7">
								<label
									htmlFor="comment"
									className="block text-[10px] font-semibold text-slate-600 uppercase mb-1"
								>
									Comment / Notes (optional)
								</label>
								<input
									id="comment"
									name="comment"
									value={form.comment}
									onChange={handleChange}
									placeholder="Any additional info..."
									className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
								/>
							</div>
						</div>
						<div className="flex justify-end gap-2 pt-3">
							<button
								type="button"
								className="px-4 py-2 rounded bg-slate-200 text-slate-900 text-sm font-semibold"
							>
								Cancel
							</button>
							<button
								type="button"
								className="px-4 py-2 rounded bg-amber-500 text-white text-sm font-semibold"
							>
								Save Draft
							</button>
							<button
								type="submit"
								className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold shadow"
							>
								Submit
							</button>
						</div>
					</section>
				</form>
			</main>
		</div>
	);
}
