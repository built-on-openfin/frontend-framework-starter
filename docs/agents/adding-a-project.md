# Adding a new framework example

1. Create `frameworks/<framework>/<project>/` with its own `package.json`. Do not add it to a root workspace — there isn't one.
2. Add the `@openfin/*` dependencies it needs, pinned to the versions in `DEFAULT_VERSIONS` in `scripts/upgrade-versions.mjs`. If it introduces an `@openfin/*` package the script doesn't yet know about, add it to `PACKAGES_TO_UPDATE` there, and to the exclusion list in the root `update-packages` script.
3. Give it a `start` and a `build` script so it matches the conventions in [Building and running](building-and-running.md). If it runs in the container, add a `launch.mjs` and a `client` script.
4. Add a `README.md` in the project directory — the root README points at these rather than documenting each project.
5. Add a build step to `.github/workflows/build.yaml` under `build-node` (`npm ci` + `npm run build`), unless it is deliberately excluded like `react/workspace-platform-starter`.
6. Run `npm run upgrade-versions` from the root to confirm the new project is picked up cleanly.

Directories named `node_modules`, `.git`, `.angular`, `.venv`, `dist` and `build` are skipped by the version script; anything else under `frameworks/` is walked.
