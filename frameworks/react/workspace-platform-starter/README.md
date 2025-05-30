# React Wrapper for Workspace Platform Starter

This project provides a React wrapper for the main [workspace-platform-starter](https://github.com/built-on-openfin/workspace-starter/tree/main/how-to/workspace-platform-starter).

Teams who prefer to use the build tooling available in the React ecosystem can use this starter to bootstrap a new Here® Core platform.

The source code stays in the original starter so that it can continue to evolve and to avoid duplication.

## Prerequsites

Please follow the [getting started](https://resources.here.io/docs/core/develop/) guide to install the OpenFin RVM.

## Getting started

### Add workspace-platform-starter source files

Manually copy the original workspace-platform-starter source files:

Clone the main workspace-starter repo

```
git clone https://github.com/built-on-openfin/workspace-starter.git --depth=1
```

Manually copy the following folders from the **how-to/workspace-platform-starter** directory:

```
client/src/framework 
client/src/modules
public/common
```

And paste them into the **/openfin** folder in this project so that you have:

```
/openfin/common
/openfin/framework
/openfin/modules
```

### Develop

```
npm install
npm run build
npm start
```

Launch [fin://localhost:8080/manifest.fin.json](fin://localhost:8080/manifest.fin.json)

### Build for production

```
npm install
npm run build
```

The files to deploy will be in the `dist` folder
