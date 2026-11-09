# CI

`.github/workflows/build.yaml` runs on push, PR and manual dispatch, in two jobs.

**`build-node`** — Node 24. For each project: `npm ci` then `npm run build`. Covers all three Angular projects, `react/container`, `react/workspace`, `react/web`, and `components/wc-fin`.

**`build-python`** — Python 3.10 with `uv`. Installs `frameworks/python/streamlit` and `frameworks/python/dash` with `uv pip install -e . --system`. Installs only; nothing is run or tested.

## Known exclusion

`frameworks/react/workspace-platform-starter` is **intentionally not built in CI**. Changes to it are not covered by the workflow — build it locally before pushing:

```bash
cd frameworks/react/workspace-platform-starter && npm ci && npm run build
```

Do not add it to `build.yaml` as a drive-by fix; the exclusion is deliberate.

## Notes

- CI uses Node 24 while the root `package.json` requires `>=22`. A change that only works on 22 will still pass CI.
- `react/web` is built with its **Webpack** scripts in CI. The Vite path (`build:vite`) is unverified by the workflow.
