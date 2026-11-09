# Building and running

Always `cd` into the project first — nothing builds from the repo root except `npm run build-all`.

```bash
cd frameworks/<framework>/<project> && npm install && npm start
```

## Non-obvious per-project behaviour

Most projects follow `npm start` / `npm run build`. These do not:

| Project | What differs |
|---|---|
| `frameworks/angular/web` | `npm start` serves **two** apps in parallel (`web` and `broker`) via `npm-run-all`; `npm run build` builds both in sequence |
| `frameworks/react/web` | Webpack is the default (`start`, `build`). Vite is a parallel set of scripts: `start:vite`, `build:vite`, `preview`. A change to this project must keep **both** toolchains working |
| `frameworks/react/workspace-platform-starter` | `build:openfin` runs Rollup to emit the OpenFin platform bundle into `public/openfin/` so Vite serves it. It is wired to `prestart` and to `build` — if you invoke Vite directly you must run `npm run build:openfin` yourself first |
| `components/wc-fin` | Stencil, not Vite/CLI: `npm run build` is `stencil build --docs`; `npm start` builds in dev/watch/serve mode |

## Build output

| Project | Output |
|---|---|
| `angular/container` | `dist/container` |
| `angular/workspace` | `dist/angular-workspace` |
| `angular/web` | `dist/web` and `dist/broker` |
| `react/container` | `build/` (Create React App) |
| `react/workspace`, `react/web`, `react/workspace-platform-starter` | `dist/` |
| `components/wc-fin` | `dist/` and `loader/` |

## Launching in the HERE Core container

`angular/container`, `angular/workspace`, `react/container` and `react/workspace` each have a `launch.mjs` and expose:

```bash
npm run client
```

Start the dev server first — `client` launches the container against the manifest URL served by that dev server, so it only works while `npm start` is running.

## Debugging a running container app

To read the console of any window or view in a running app, see [Debugging with CDP](debugging-with-cdp.md).

## Tests and linting

There is no repo-wide test, lint or typecheck command, and coverage is uneven — check the project's `package.json` rather than assuming:

- `test`: Angular projects and `react/container` only.
- `lint`: Angular `container` and `workspace`, and the Vite-based React projects.

Vite-based React projects typecheck as part of `build` (`tsc -b && vite build`), so a failing build may be a type error rather than a bundling error.
