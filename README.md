![Frontend Framework Starter](./assets/HERO-STARTER-FRONTEND.png)

> **_:information_source: HERE Core UI:_** [HERE Core UI](https://resources.here.io/docs/core/hc-ui/) is a commercial product and this repo is for evaluation purposes. Use of the HERE Core Container and HERE Core UI components is only granted pursuant to a license from HERE. Please [**contact us**](https://www.here.io/contact) if you would like to request a developer evaluation key or to discuss a production license.

## Frontend Framework Starter

HERE Core is framework-agnostic. Our documentation and example repos do not use a specific frontend framework and use JavaScript/TypeScript and css where possible. If you are using a frontend framework and are looking to get started with OpenFin we have created some basic examples to help you get started.

Deeper coverage of the HERE Core capability is covered by the [Container Starters](https://github.com/built-on-openfin/container-starter) and [Workspace Starters](https://github.com/built-on-openfin/workspace-starter).

### Frameworks

The frameworks with examples can be found in the following folders.

* [Angular](./frameworks/angular)
* [React](./frameworks/react)

Please see the README.md files in each sub-folder for more details on getting started with each project.

### Branches

The current main branch always matches the stable release of the HERE Core components.

There are older branches which match the container/workspace release with the version of the frameworks that were available at the time of release.

https://github.com/built-on-openfin/frontend-framework-starter/branches/all

### Maintenance

#### Upgrade Script

To automate the upgrade of HERE versions across all projects in the repo, use the `upgrade-versions.mjs` script. This script updates `package.json` dependencies, `manifest.fin.json` runtime settings, and version references in documentation.

Run with default versions (configured inside the script):
```bash
npm run upgrade-versions
```
