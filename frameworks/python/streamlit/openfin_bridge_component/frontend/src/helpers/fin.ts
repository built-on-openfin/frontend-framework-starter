// Attempt to resolve the OpenFin `fin` object from this window or any ancestor
// (parent/top) or opener. Streamlit mounts components in an iframe, and
// OpenFin may only inject `fin` on the top-level window.
export function findFinApi(): any | null {
  function tryGet(w: any): any | null {
    try {
      if (w && typeof w.fin !== "undefined" && w.fin) return w.fin
    } catch {
      // Cross-origin access; ignore
    }
    return null
  }

  // 1) Check self
  let fin = tryGet(window as any)
  if (fin) return fin

  // 2) Walk up parents (guard against cycles and cross-origin)
  let safety = 0
  let cur: any = window
  while (safety++ < 10) {
    try {
      if (!cur || !cur.parent || cur.parent === cur) break
    } catch {
      break
    }
    cur = cur.parent
    fin = tryGet(cur)
    if (fin) return fin
  }

  // 3) Try top directly (in case the loop bailed early)
  fin = tryGet((window as any).top)
  if (fin) return fin

  // 4) Try opener (popout scenarios)
  fin = tryGet((window as any).opener)
  if (fin) return fin

  return null
}
