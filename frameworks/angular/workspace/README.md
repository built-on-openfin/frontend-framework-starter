# HERE Front-End Framework Starter: Angular Workspace

Shows usage patterns using HERE Core with Angular 22+

Demonstrates newer patterns and best practices encouraged in the Angular community including:

- [Standalone components](https://angular.dev/guide/components) without modules
- [Signals](https://angular.dev/guide/signals) for reactivity and data binding
- [Zoneless change detection](https://angular.dev/guide/zoneless) (no `zone.js`)
- [Built-in control flow](https://angular.dev/guide/templates/control-flow) (`@if` / `@for`)
- [`takeUntilDestroyed`](https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed) for subscription cleanup
- [Strict mode](https://angular.dev/tools/cli/template-typecheck#strict-mode) following strict eslint and TypeScript rules
- Adherence to [Angular style guide](https://angular.dev/style-guide)
- Service pattern 
- RxJS observables wrapping promise-based platform apis

For more comprehensive examples of HERE features see the [workspace-starter](https://github.com/built-on-openfin/workspace-starter) repo.

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) and is kept up to date with Angular 22.

## Prerequisites

HERE RVM  
Node.js v22.12+

## Getting started

Install dependencies

```
npm install
```

Start the Angular dev server

```
npm start
```

Launch HERE Core (separate console)

```
npm run client
```
