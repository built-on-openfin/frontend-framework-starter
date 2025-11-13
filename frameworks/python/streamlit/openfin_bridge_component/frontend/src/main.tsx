import React, { useEffect, useMemo, useRef } from "react"
import { createRoot } from "react-dom/client"
import { Streamlit, withStreamlitConnection } from "streamlit-component-lib"
import { mapInbound, mapOutbound, hashContext } from './helpers/context';
import { findFinApi } from './helpers/fin';

type Args = {
  eventType?: string | null
  data?: any
}

function useStableJson<T>(value: T): string {
  // Recompute JSON only when necessary to keep useEffect deps stable
  return useMemo(() => JSON.stringify(value ?? null), [value])
}

const SUPPRESSION_WINDOW_MS = 900 // ignore self-echo within this window

function Bridge({ args }: { args: Args }) {
  const groupRef = useRef<any>(null)
  const argsJson = useStableJson(args)
  const lastOutboundHashRef = useRef<string | null>(null)
  const lastOutboundAtRef = useRef<number>(0)

  // Make the component effectively invisible
  useEffect(() => {
    try {
      Streamlit.setFrameHeight(0)
    } catch {}
  }, [])

  // Initialize OpenFin interop and context handler once
  useEffect(() => {
    let disposed = false
    let listener: any

    async function init() {
      const fin = findFinApi()
      const hasFin = !!fin
      if (!hasFin) {
        Streamlit.setComponentValue({ status: "not_available", ts: Date.now() })
        return
      }
      try {
        const interop = fin.Interop.connectSync(fin.me.uuid, {})
        const group = await interop.joinSessionContextGroup("stockpeers")
        groupRef.current = group
        listener = group.addContextHandler((context: any) => {
          if (disposed) return
          // Self-echo suppression: if the inbound context matches the most
          // recent outbound within a short window, ignore it.
          try {
            const inHash = hashContext(context)
            const now = Date.now()
            if (
              lastOutboundHashRef.current &&
              inHash === lastOutboundHashRef.current &&
              now - lastOutboundAtRef.current < SUPPRESSION_WINDOW_MS
            ) {
              // eslint-disable-next-line no-console
              console.debug("[OpenFinBridge] Suppressed self-echo context")
              return
            }
          } catch {}

          const payload = mapInbound(context)
          Streamlit.setComponentValue({ payload, ts: Date.now() })
        })
        Streamlit.setComponentValue({ status: "connected", ts: Date.now() })
      } catch (e: any) {
        console.error("[OpenFinBridge] init error", e)
        Streamlit.setComponentValue({ status: "error", error: String(e), ts: Date.now() })
      }
    }

    init()
    return () => {
      disposed = true
      try {
        listener?.unsubscribe?.()
      } catch {}
    }
  }, [])

  // Outbound broadcast when args change
  useEffect(() => {
    const parsed: Args = JSON.parse(argsJson)
    const ctx = mapOutbound(parsed?.eventType, parsed?.data)
    if (!ctx || !groupRef.current) return
    try {
      // Record hash & timestamp for self-echo suppression on next inbound
      lastOutboundHashRef.current = hashContext(ctx)
      lastOutboundAtRef.current = Date.now()
    } catch {}
    groupRef.current
      .setContext(ctx)
      .catch((e: any) => console.error("[OpenFinBridge] setContext error", e))
  }, [argsJson])

  return null
}

const Connected = withStreamlitConnection(Bridge as any)
const root = createRoot(document.getElementById("root")!)
root.render(React.createElement(Connected))
