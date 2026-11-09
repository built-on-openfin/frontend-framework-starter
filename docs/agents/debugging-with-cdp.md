# Debugging a running app with CDP

An agent can read the console of any window or view in a running HERE Core app without a human
opening DevTools, using `scripts/launch-debug.mjs`.

The script fetches the project's manifest, injects `--remote-debugging-port` and an isolated
`--security-realm`, re-serves the patched manifest from a local port (the manifest in the repo is
never modified), launches it, then attaches over the Chrome DevTools Protocol to every page target
and streams `console.*`, `Log.entryAdded` and `Runtime.exceptionThrown` to stdout. The platform is
quit on exit, so no orphaned runtime is left behind.

## Usage

Start the project's dev server first, then launch from the repo root:

```bash
cd frameworks/react/container && npm start
```

```bash
npm run launch-debug -- frameworks/react/container http://localhost:3000/platform/manifest.fin.json --duration=45
```

| Argument | Meaning |
|---|---|
| `<projectDir>` | Project to resolve `@openfin/node-adapter` from — it is installed per project, not at the repo root |
| `<manifestUrl>` | The manifest the project serves, e.g. `http://localhost:3000/platform/manifest.fin.json` |
| `--cdp-port=9222` | Port the runtime exposes CDP on |
| `--manifest-port=<cdp-port + 1>` | Port the patched manifest is served from |
| `--duration=<seconds>` | Exit after N seconds; omit to stream until Ctrl+C |

Raw CDP is reachable while the app runs: `curl http://127.0.0.1:9222/json/list`.

## Gotchas

- **Views are separate targets.** Each view is its own CDP page target and they appear a second or
  two after the provider window, which is why the script keeps polling `/json/list` instead of
  attaching once at startup.
- **The runtime caches JS chunks per security realm.** After changing anything under `node_modules`,
  clear the realm cache or you will keep debugging the previous bundle — on macOS:
  `rm -rf ~/Library/Application\ Support/OpenFin/cache/cdp-debug-<port>`.
- **Restart the dev server after `node_modules` changes.** CRA does not watch `node_modules`, so a
  running dev server keeps serving the vendor chunk it built earlier. Clear
  `<project>/node_modules/.cache` as well.
- **Give it enough time.** Attaching to all views and seeing their startup errors takes roughly
  20-30 seconds from a cold runtime; `--duration=45` is a safe default.

## Reading the output

Lines are prefixed with the target title, which is the view/window name:

```
[React App] console.error: [@openfin/notifications] Failed to launch Notifications - ReferenceError: NOTIFICATIONS_MANIFEST_URL is not defined
[React App] exception: ReferenceError: NOTIFICATIONS_MANIFEST_URL is not defined
```

Some noise is expected in every run and is not worth chasing: the missing licence key and
`supportInformation` warnings, and the React Router v7 future-flag warnings.
