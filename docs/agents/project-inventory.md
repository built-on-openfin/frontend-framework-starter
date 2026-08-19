# Project inventory

Each row is an independent app with its own `package.json` (or `pyproject.toml`). Framework versions are intentionally omitted — read the project's manifest for those.

## Angular — `frameworks/angular/`

| Path | Demonstrates |
|---|---|
| `container/` | HERE Core container app (`@openfin/core`, `@openfin/workspace`) |
| `workspace/` | Workspace platform app (`@openfin/workspace-platform`) |
| `web/` | Browser-only HERE Core Web (`@openfin/core-web`). Two Angular apps in one project: `web` and `broker` |

## React — `frameworks/react/`

| Path | Demonstrates |
|---|---|
| `container/` | HERE Core container app. The only remaining Create React App project |
| `workspace/` | Workspace platform app, Vite |
| `web/` | Browser-only HERE Core Web. Maintained against **both** Webpack and Vite |
| `workspace-platform-starter/` | The advanced example: workspace platform with a Rollup-built OpenFin bundle alongside the Vite app |

## Python — `frameworks/python/`

| Path | Demonstrates |
|---|---|
| `streamlit/` | Streamlit app with a Flask sidecar |
| `dash/` | Dash / Plotly app |

## Web components — `components/`

| Path | Demonstrates |
|---|---|
| `wc-fin/` | Stencil component library; emits web components plus React wrappers |

## Repo-level directories

- `scripts/` — maintenance tooling, run from the root (see [Version management](version-management.md) and [Building and running](building-and-running.md))
- `assets/` — images used by README files
- `.github/workflows/` — see [CI](ci.md)
