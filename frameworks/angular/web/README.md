# HERE Core Web with Angular

OpenFin frontend framework starter demonstrating the use of HERE [core-web](https://www.npmjs.com/package/@openfin/core-web) with Angular. 

The focus of this starter is on project structure, bundling, and tooling within the Angular ecosystem. For more comprehensive examples of HERE Core features, see the [web-starter samples](https://github.com/built-on-openfin/web-starter).

Built with Angular 22 using current best practices: standalone components, [zoneless change detection](https://angular.dev/guide/zoneless) (no `zone.js`), and [signal-based queries](https://angular.dev/guide/signals/queries) (`viewChild`).

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) and is kept up to date with Angular 22.

## Getting started

```
npm install
npm start
```

Open [http://localhost:4200/](http://localhost:4200/)

Note two projects ('web' and 'broker') are configured in the angular.json and can be built and served separately. The npm scripts run both concurrently.
