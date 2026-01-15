# Front-end Framework Starter

HERE Core is framework-agnostic. Our documentation and example repos do not use a specific frontend framework and use JavaScript/TypeScript and css where possible. If you are using a frontend framework and are looking to get started with OpenFin we have created some basic examples to help you get started.

Deeper coverage of the HERE Core capability is covered by the [Container Starters](https://github.com/built-on-openfin/container-starter) and [Workspace Starters](https://github.com/built-on-openfin/workspace-starter).

## Frameworks

The frameworks with examples can be found in the following folders.

* [Angular](./frameworks/angular)
* [React](./frameworks/react)

Please see the README.md files in each sub-folder for more details on getting started with each project.

## Branches

The current main branch always matches the stable release of the HERE Core components.

There are older branches which match the container/workspace release with the version of the frameworks that were available at the time of release.

https://github.com/built-on-openfin/frontend-framework-starter/branches/all

## Upgrade Script

To automate the upgrade of HERE versions across all projects, use the `upgrade-versions.mjs` script. This script updates `package.json` dependencies, `manifest.fin.json` runtime settings, and version references in documentation.

### Usage

Run with default versions (configured inside the script):
```bash
node scripts/upgrade-versions.mjs
```

### Flags

- `--runtime <version>`: Updates the runtime version in manifests and markdown.
- `--workspace <version>`: Updates `@openfin/workspace` and `@openfin/workspace-platform` (coupled).
- `--core <version>`: Updates `@openfin/core` and `@openfin/node-adapter` (coupled).
- `--core-web <version>`: Updates `@openfin/core-web` (independent).
