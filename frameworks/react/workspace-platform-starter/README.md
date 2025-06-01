# React Wrapper for Workspace Platform Starter

This project provides a React wrapper for the [workspace-platform-starter](https://github.com/built-on-openfin/workspace-starter/tree/main/how-to/workspace-platform-starter) for teams 
who prefer to use the build tooling available in the React ecosystem such as hot reloading.

The workspace platform starter source files are for demonstration purposes and to help get started building your own project. Once the source is added to your project, consider it your 
source code to manage for your production build. Once initial setup is complete, you should review the features you need and turn off many of the modules in the manifest.fin.json, and 
remove many of the app endpoints listed in "appProvider" / "endpointIds".

## Prerequsites

Please follow the [getting started](https://resources.here.io/docs/core/develop/) guide to install the OpenFin RVM.

## Copy workspace-platform-starter source files

Manually add the original workspace-platform-starter source files into this project:

Clone the main workspace-starter repo:

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



