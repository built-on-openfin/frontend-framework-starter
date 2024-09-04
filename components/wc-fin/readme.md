# Web Components

Reusable web components for starter projects

Built with [Stencil](https://stenciljs.com/)

## Getting Started

Run:

```bash
npm install
npm start
```

To build the components for production, run:

```bash
npm run build
```

Need help? Check out our docs [here](https://stenciljs.com/docs/my-first-component).

## Using this component

1. Copy the contents of `dist/www/build` to you project and ensure they are distributed with your output files to be consumed at runtime
2. Put a script tag similar to this `<script src='path/to/wc-fin.esm.js'></script>` in the head of your index.html
3. You can use the element anywhere in your template, JSX, html etc

## React component wrapper

To use the component in a React project, a wrapper component is generated at build time to `dist/react/component.ts`

1. `npm install @stencil/react-output-target`
2. Copy the `custom-elements` folder to your project
3. Copy `react/component.ts` component to your project source
4. Adjust the relative path to `fin-context-group-picker.js` in the component imports
5. Add `"moduleResolution": "bundler"` to your tsconfig.json

## Components

The settings available for the components can be seen here:

- [fin-context-group-picker](src/components/context-group-picker/readme.md)
