# AGENTS.md

Starter templates demonstrating HERE Core (OpenFin) integration with Angular, React, Python and Stencil web components. Every top-level example is a self-contained app, not a library.

## Essentials

- **There are no npm workspaces.** Each project installs, builds and runs independently — `cd` into the project directory before running anything. The root `package.json` holds maintenance scripts only.
- **Node projects:** npm, Node >= 22 (CI runs 24). **Python projects:** `uv`, Python >= 3.10.
- **Never hand-edit `@openfin/*` versions.** Run `npm run upgrade-versions` from the repo root — see [Version management](docs/agents/version-management.md).
- **No repo-wide test/lint/typecheck.** A project's `npm run build` is its check; per-project `test` and `lint` scripts are inconsistent. `npm run build-all` builds every project.
- Framework and dependency versions are deliberately not documented here. Read the relevant `package.json`.

## Reference

| Document | Read it when |
|---|---|
| [Project inventory](docs/agents/project-inventory.md) | Locating the right example, or deciding where a change belongs |
| [Building and running](docs/agents/building-and-running.md) | Building, serving, or launching a project in the container |
| [Debugging with CDP](docs/agents/debugging-with-cdp.md) | Reading the console of a running container app, or chasing a runtime error in a view |
| [Version management](docs/agents/version-management.md) | Bumping HERE Core versions or updating any dependency |
| [CI](docs/agents/ci.md) | Changing the build workflow, or checking what CI actually covers |
| [Adding a project](docs/agents/adding-a-project.md) | Adding a new framework example to the repo |
