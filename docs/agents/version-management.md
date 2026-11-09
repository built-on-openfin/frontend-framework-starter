# Version management

All projects move together on one HERE Core version. Do not hand-edit `@openfin/*` versions in individual `package.json` files — the versions also appear in `manifest.fin.json` runtime settings and in documentation URLs, and only the script updates all three.

## Bumping HERE Core versions

`scripts/upgrade-versions.mjs` is the single source of truth. Its `DEFAULT_VERSIONS` object at the top of the file holds the current target versions; a release bump means editing that object, then running:

```bash
npm run upgrade-versions
```

It walks `frameworks/` and the repo root, updates dependency ranges, `manifest.fin.json` runtime versions and versioned URLs in `.html/.json/.ts/.tsx/.js/.jsx/.md` files, then installs and builds each project.

Overrides are passed as space-separated flags:

```bash
node scripts/upgrade-versions.mjs --runtime 44.146.101.5 --core 44.101.7 --workspace 24.0.22
```

Two flags are deliberately coupled — this is why manual edits drift:

- `--core` sets both `@openfin/core` **and** `@openfin/node-adapter`
- `--workspace` sets both `@openfin/workspace` **and** `@openfin/workspace-platform`

Other flags: `--core-web`, `--node-adapter`, `--workspace-platform`, `--runtime`. Use `--install-only` to skip builds, `--build-only` to skip installs (the root `npm run build-all` is `--build-only`).

## Updating everything else

From the repo root:

```bash
npm run list-update-packages   # writes updatable-packages.txt
npm run update-packages        # applies npm-check-updates across all projects
```

`update-packages` excludes `@openfin/core`, `@openfin/node-adapter`, `@openfin/workspace` and `@openfin/workspace-platform` by design, so that HERE versions stay owned by `upgrade-versions.mjs`. Keep that exclusion list in sync if a new `@openfin/*` package is added.

`npm run remove-packages` wipes every `node_modules` and `package-lock.json` in the repo — a clean-slate reset, not a routine step.

## Python

Python projects are not covered by any of the above. Bump dependencies in each `pyproject.toml` and refresh that project's `uv.lock`.
