# OpenFin Web Starter - React

Demonstrates an [OpenFin Web](https://www.npmjs.com/package/@openfin/core-web) application built with React.

The focus of this starter is on project structure and bundling for modern web applications using React. For more comprehensive examples see the [web-starter samples](https://github.com/built-on-openfin/web-starter).

Two bundler configs are provided: Vite and Webpack. 

## Getting started for development

Note that these examples assume you are in the subdirectory for the example.

Install dependencies:

```shell
npm install
```

Start the app:

```shell
npm start           // webpack
npm start:vite      // vite
```

Open the app in your browser:
http://localhost:3000

## Build for production

```shell
npm run build           // webpack
npm run build:vite      // vite
```

## Steps to creating your own OpenFin web applications

1. NPM install `@openfin/core-web`
2. Create an OpenFin manifest file and serve it. See: `public/manifest.json`
3. Create a layout file and serve it. See: `public/default.layout.fin.json`
4. Ensure an element in the DOM has an ID matching the one specified in the manifest, eg `id="layout_container"`
5. Initialize the framework. See `main.tsx` and `provider.ts`

## Troubleshooting

- Ensure two html files are created by the bundler (index.html and iframe-broker.html) and they link to the correct JS bundles
- Ensure the layout and manifest files are served by the webserver
- Ensure the urls are correct in `src/config.ts`
- Ensure the shared worker file has been copied correctly to the output directory
- Contact support@here.io for further guidance
