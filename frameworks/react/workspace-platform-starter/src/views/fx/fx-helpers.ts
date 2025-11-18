import type { Context } from "@finos/fdc3";
import type { IRowNode, ValueFormatterParams } from "ag-grid-community";

// Domain types for FX rows and FDC3 contexts
export interface FxRow {
  id: string;
  pair: string;
  lp: string;
  bid: number;
  ask: number;
  mid: number;
  spreadPips: number;
  ts: string; // ISO timestamp
  volumeMM: number;
  status: string;
  comment: string;
}

export interface FxRowWithPrev extends FxRow {
  prevBid: number;
  prevAsk: number;
  prevMid: number;
}

export interface InstrumentContext extends Context {
  type: "fdc3.instrument";
  name: string;
  id: { id: string };
  lp?: string;
  bid?: number;
  ask?: number;
  mid?: number;
  ts?: string;
  volumeMM?: number;
  status?: string;
}

export interface InstrumentListContext extends Context {
  type: "fdc3.instrumentList";
  instruments: InstrumentContext[];
}

// Custom context our app listens for to update row comments
export interface InstrumentCommentContext extends Context {
  type: "here.instrumentComment";
  id?: { pair?: string; comment?: string };
  pair?: string;
  comment?: string;
}

export const numberFormatter =
  (dp = 2) =>
  (p: ValueFormatterParams<FxRowWithPrev, number>) =>
    p.value == null
      ? ""
      : Number(p.value).toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp });

export const isoFormatter = (p: ValueFormatterParams<FxRowWithPrev, string>) =>
  p.value ? new Date(p.value).toISOString().replace(".000", "") : "";

// Format bid/ask/mid based on pair decimals (JPY pairs -> 3dp, others -> 5dp)
export const fxPxFormatter = (p: ValueFormatterParams<FxRowWithPrev, number>) => {
  if (p.value == null) return "";
  const pair = p.data?.pair || "";
  const dp = /\/JPY$/.test(pair) ? 3 : 5;
  return Number(p.value).toFixed(dp);
};

// Helper to color price movement direction
export const dirClass = (curr: number, prev?: number) => {
  if (prev == null || curr === prev) return "";
  return curr > prev ? "text-emerald-600" : "text-rose-600";
};

export const rows: FxRow[] = [
  {
    id: "eur-usd-citi",
    pair: "EUR/USD",
    lp: "Citi",
    bid: 1.08532,
    ask: 1.08536,
    mid: 1.08534,
    spreadPips: 0.4,
    ts: "2025-10-24T05:42:10Z",
    volumeMM: 5,
    status: "Streaming",
    comment: "",
  },
  {
    id: "eur-usd-jpm",
    pair: "EUR/USD",
    lp: "JPM",
    bid: 1.0853,
    ask: 1.08535,
    mid: 1.08533,
    spreadPips: 0.5,
    ts: "2025-10-24T05:42:10Z",
    volumeMM: 10,
    status: "Streaming",
    comment: "",
  },
  {
    id: "eur-usd-ubs",
    pair: "EUR/USD",
    lp: "UBS",
    bid: 1.08533,
    ask: 1.08537,
    mid: 1.08535,
    spreadPips: 0.4,
    ts: "2025-10-24T05:42:10Z",
    volumeMM: 7,
    status: "Streaming",
    comment: "",
  },
  {
    id: "usd-jpy-citi",
    pair: "USD/JPY",
    lp: "Citi",
    bid: 149.82,
    ask: 149.827,
    mid: 149.8235,
    spreadPips: 0.7,
    ts: "2025-10-24T05:42:11Z",
    volumeMM: 8,
    status: "Streaming",
    comment: "",
  },
  {
    id: "usd-jpy-barc",
    pair: "USD/JPY",
    lp: "Barclays",
    bid: 149.818,
    ask: 149.826,
    mid: 149.822,
    spreadPips: 0.8,
    ts: "2025-10-24T05:42:11Z",
    volumeMM: 5,
    status: "Streaming",
    comment: "",
  },
  {
    id: "usd-jpy-hsbc",
    pair: "USD/JPY",
    lp: "HSBC",
    bid: 149.821,
    ask: 149.828,
    mid: 149.8245,
    spreadPips: 0.7,
    ts: "2025-10-24T05:42:11Z",
    volumeMM: 6,
    status: "Streaming",
    comment: "",
  },
  {
    id: "gbp-usd-citi",
    pair: "GBP/USD",
    lp: "Citi",
    bid: 1.27411,
    ask: 1.27418,
    mid: 1.27415,
    spreadPips: 0.7,
    ts: "2025-10-24T05:42:12Z",
    volumeMM: 5,
    status: "Streaming",
    comment: "",
  },
  {
    id: "gbp-usd-db",
    pair: "GBP/USD",
    lp: "Deutsche",
    bid: 1.2741,
    ask: 1.27416,
    mid: 1.27413,
    spreadPips: 0.6,
    ts: "2025-10-24T05:42:12Z",
    volumeMM: 9,
    status: "Streaming",
    comment: "",
  },
  {
    id: "aud-usd-citi",
    pair: "AUD/USD",
    lp: "Citi",
    bid: 0.63986,
    ask: 0.63991,
    mid: 0.63989,
    spreadPips: 0.5,
    ts: "2025-10-24T05:42:13Z",
    volumeMM: 5,
    status: "Streaming",
    comment: "",
  },
  {
    id: "aud-usd-hsbc",
    pair: "AUD/USD",
    lp: "HSBC",
    bid: 0.63984,
    ask: 0.6399,
    mid: 0.63987,
    spreadPips: 0.6,
    ts: "2025-10-24T05:42:13Z",
    volumeMM: 6,
    status: "Streaming",
    comment: "",
  },
  {
    id: "usd-chf-ubs",
    pair: "USD/CHF",
    lp: "UBS",
    bid: 0.90114,
    ask: 0.90119,
    mid: 0.90117,
    spreadPips: 0.5,
    ts: "2025-10-24T05:42:14Z",
    volumeMM: 5,
    status: "Streaming",
    comment: "",
  },
  {
    id: "usd-cad-rbc",
    pair: "USD/CAD",
    lp: "RBC",
    bid: 1.36605,
    ask: 1.36611,
    mid: 1.36608,
    spreadPips: 0.6,
    ts: "2025-10-24T05:42:14Z",
    volumeMM: 8,
    status: "Streaming",
    comment: "",
  },
  {
    id: "nzd-usd-citi",
    pair: "NZD/USD",
    lp: "Citi",
    bid: 0.58834,
    ask: 0.5884,
    mid: 0.58837,
    spreadPips: 0.6,
    ts: "2025-10-24T05:42:15Z",
    volumeMM: 4,
    status: "Streaming",
    comment: "",
  },
  {
    id: "eur-gbp-barc",
    pair: "EUR/GBP",
    lp: "Barclays",
    bid: 0.85201,
    ask: 0.85206,
    mid: 0.85204,
    spreadPips: 0.5,
    ts: "2025-10-24T05:42:15Z",
    volumeMM: 6,
    status: "Streaming",
    comment: "",
  },
];

export const rowToInstrument = (node: IRowNode<FxRowWithPrev> | null | undefined): InstrumentContext | null => {
  if (!node || !node.data) return null;
  const d = node.data;
  const pair: string | undefined = d.pair;
  if (!pair) return null;
  const instrument: InstrumentContext = {
    type: "fdc3.instrument",
    name: pair,
    id: {
      id: d.id,
    },
    // Additional fields from the selected row (non-standard but useful metadata)
    lp: d.lp,
    bid: d.bid,
    ask: d.ask,
    mid: d.mid,
    ts: d.ts,
    volumeMM: d.volumeMM,
    status: d.status,
  };
  return instrument;
};

// Simple ticking engine: random walk the mid and keep spread around current value
export const getPrice = (r: FxRowWithPrev): FxRowWithPrev => {
  // Update only some rows each tick
  if (Math.random() < 0.5) return r;

  const isJpy = /\/JPY$/.test(r.pair);
  const pip = isJpy ? 0.01 : 0.0001;

  const prevMid = (r.bid + r.ask) / 2;
  const dir = Math.random() < 0.5 ? -1 : 1;
  const stepPipChoices = [0.1, 0.2, 0.3, 0.5]; // fraction of a pip
  const stepPips = stepPipChoices[Math.floor(Math.random() * stepPipChoices.length)] * dir;
  const newMid = prevMid + stepPips * pip;

  // Allow slight spread breathing but clamp to a realistic range
  let newSpreadPips = r.spreadPips + (Math.random() - 0.5) * 0.2; // +/- 0.1 pips
  newSpreadPips = Math.max(0.2, Math.min(1.5, newSpreadPips));

  const half = (newSpreadPips * pip) / 2;
  const newBid = newMid - half;
  const newAsk = newMid + half;

  return {
    ...r,
    prevBid: r.bid,
    prevAsk: r.ask,
    prevMid: r.mid,
    bid: newBid,
    ask: newAsk,
    mid: (newBid + newAsk) / 2,
    spreadPips: (newAsk - newBid) / pip,
    ts: new Date().toISOString(),
  };
};
