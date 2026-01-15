# React Wrapper for Workspace Platform Starter

This project provides a React wrapper for the [workspace-platform-starter](https://github.com/built-on-openfin/workspace-starter/tree/main/how-to/workspace-platform-starter) for teams who prefer to use the build tooling available in the React ecosystem for a familiar development experience.

To use this project, the source files are manually copied into the project from the [workspace-platform-starter](https://github.com/built-on-openfin/workspace-starter/tree/main/how-to/workspace-platform-starter) project. A simple React-based provider demonstrates how to bootstrap a platform.

This can then form the basis of your own HERE Core platform. The source within the /openfin folder becomes your source code to customize as you need to.

Once setup, see the next steps section below.

## Prerequsites

Please follow the [getting started](https://resources.here.io/docs/core/develop/) guide to install the OpenFin RVM.

## Copy workspace-platform-starter source files

Manually add the original workspace-platform-starter source files into this project:

Clone the main workspace-starter repo:

```
git clone https://github.com/built-on-openfin/workspace-starter.git --depth=1
```

Manually copy the following folders from the **how-to/workspace-platform-starter** directory into the openfin folder:

```
client/src/framework -> openfin/framework
client/src/modules -> openfin/modules
public/common -> openfin/common
public/schemas -> openfin/schemas (optional, to help with manifest and app configuration)
```

The **/openfin** folder in this project should then look like:

```
/openfin/framework
/openfin/modules
/openfin/common
```

### Develop

```
npm install
npm start
```

Launch [fin://localhost:8080/manifest.fin.json](fin://localhost:8080/manifest.fin.json)

### Build for production

```
npm install
npm run build
```

The files to deploy will be in the `dist` folder

### Preview production build

```
npm run preview
```
Launch [fin://localhost:8080/manifest.fin.json](fin://localhost:8080/manifest.fin.json)

## Next steps

- Remove or disable modules you don't need in public/manifest.fin.json
- If necessary, remove modules from the build step in rollup.config.mjs
- Remove the example app endpoints listed in "appProvider" / "endpointIds" in manifest.fin.json
- Define your apps in /public/apps.json
- Customize your theme in the themeProvider section of the manifest.fin.json
- Follow the [how-to](https://github.com/built-on-openfin/workspace-starter/tree/main/how-to/workspace-platform-starter/docs) documentation to further customize your platform

## Debugging

### Source maps

Source maps are disabled by default assuming a production-like configuration. 

To enable source maps for debugging, modify the `rollup.config.mjs` file to include source maps in the output configuration:

```javascript
{
  ...
  output: {
    ...
    sourcemap: true
  }
}
```
