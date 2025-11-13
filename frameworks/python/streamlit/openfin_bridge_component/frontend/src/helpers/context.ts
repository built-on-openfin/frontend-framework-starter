export const logger = console;

export function mapInbound(context: any) {
  const payload: any = {
    context_type: context?.type,
    context,
    timestamp: new Date().toISOString(),
  }

  logger.log('Mapping inbound context:', context);

  if (context?.type === "instrument") {
    payload.action = "update_tickers"
    const t = context?.id?.ticker
    payload.tickers = t ? [String(t)] : []
  } else if (context?.type === "instrumentList") {
    payload.action = "update_tickers"
    payload.tickers = (context?.instruments ?? [])
      .map((inst: any) => inst?.id?.ticker)
      .filter(Boolean)
      .map(String)
  } else if (context?.type === "streamlit.timeHorizon") {
    payload.action = "update_horizon"
    payload.horizon = context?.horizon
    payload.horizonValue = context?.horizonValue
  }

  return payload
}

export function mapOutbound(eventType?: string | null, data?: any) {
  if (!eventType) return null

  logger.log('Mapping outbound context:', eventType, data);

  if (eventType === "ticker_selection_changed") {
    const tickers: string[] = Array.isArray(data?.tickers) ? data.tickers : []
    if (tickers.length > 0) {
      return {
        type: "instrumentList",
        instruments: tickers.map((ticker) => ({
          type: "instrument",
          id: { ticker },
        })),
      }
    }
    return null
  }

  if (eventType === "horizon_changed") {
    return {
      type: "streamlit.timeHorizon",
      horizon: data?.horizon,
      horizonValue: data?.horizon_value,
      timestamp: new Date().toISOString(),
    }
  }

  return {
    type: "streamlit.event",
    event: eventType,
    data,
    timestamp: new Date().toISOString(),
  }
}

// ------------------------------------------------------------
// Echo suppression helpers
// We canonicalize contexts and compute a stable string hash so that
// we can compare outbound and inbound contexts reliably regardless of
// ordering differences, casing, or irrelevant fields like timestamps.
// ------------------------------------------------------------

function stableStringify(obj: any): string {
  const seen = new WeakSet()
  const stringify = (value: any): any => {
    if (value === null || typeof value !== "object") return value
    if (seen.has(value)) return undefined
    seen.add(value)
    if (Array.isArray(value)) {
      return value.map((v) => stringify(v))
    }
    const keys = Object.keys(value).sort()
    const out: Record<string, any> = {}
    for (const k of keys) out[k] = stringify(value[k])
    return out
  }
  return JSON.stringify(stringify(obj))
}

export function canonicalizeContext(context: any): any {
  const type = context?.type
  if (type === "instrument") {
    const t = String(context?.id?.ticker ?? "").toUpperCase()
    return { type: "instrument", tickers: t ? [t] : [] }
  }
  if (type === "instrumentList") {
    const tickers: string[] = (context?.instruments ?? [])
      .map((inst: any) => String(inst?.id?.ticker ?? "").toUpperCase())
      .filter(Boolean)
    // sort + dedupe
    const uniq = Array.from(new Set(tickers)).sort()
    return { type: "instrumentList", tickers: uniq }
  }
  if (type === "streamlit.timeHorizon") {
    // Ignore timestamp or extra fields; horizonValue is the canonical key
    return {
      type: "streamlit.timeHorizon",
      horizon: context?.horizon,
      horizonValue: context?.horizonValue,
    }
  }
  // Generic fallback: drop obvious volatile fields
  const { timestamp, ts, ...rest } = context ?? {}
  return { type: type ?? rest?.type ?? "unknown", ...rest }
}

export function hashContext(context: any): string {
  try {
    const canon = canonicalizeContext(context)
    return stableStringify(canon)
  } catch (e) {
    try {
      return JSON.stringify(context)
    } catch {
      return String(context)
    }
  }
}
