# HERE Core Web - FDC3 Intent Flow

This project demonstrates the minimum viable [FDC3 2.0](https://fdc3.finos.org/docs/2.0/fdc3-intro) intent flow in an [OpenFin core-web](https://www.npmjs.com/package/@openfin/core-web) application built with React.

The goal is to show the smallest useful path for raising and handling an intent:

1. An app running in an OpenFin core-web view calls `fdc3.raiseIntent(intentName, context)`.
2. The provider reads `public/apps.json` to find the first app that declares support for that intent and context type.
3. The provider launches a new app view in the current layout.
4. The launched app registers an intent listener with `fdc3.addIntentListener`.
5. The provider delivers the raised context payload to that listener.

## What this example is not

This starter intentionally does not demonstrate the full FDC3 intent resolution specification. It does not include:

- An intent resolver or picker UI.
- `raiseIntentForContext`.
- Targeting an existing app or app instance.
- Multiple layouts or layout selection.
- App instance selection when more than one app can handle an intent.

If more than one app in `apps.json` supports the same intent and context type, the first matching app wins.

## Demo flow

Open the app at:

```text
http://localhost:3000
```

Then:

1. In the `FDC3 Intents` tab, choose `View Contact`.
2. Edit the `name` field in the context JSON.
3. Click `Raise Intent`.
4. Confirm a `Contact` tab opens and receives the same context with `type: "fdc3.contact"`.
5. Choose `View Quote`.
6. Edit the `ticker` field in the context JSON.
7. Click `Raise Intent`.
8. Confirm a `Quote` tab opens and receives the same context with `type: "custom.instrument"`.

## Key files

- `public/apps.json` defines the apps and the intent/context pairs they listen for.
- `public/default.layout.fin.json` defines the single starter layout.
- `src/platform/provider.ts` initializes the OpenFin core-web provider and broker override.
- `src/platform/broker/interop-override.ts` contains the minimal intent handling flow.
- `src/routes/views/intents.tsx` raises intents from the demo UI.
- `src/routes/views/view-contact.tsx` and `src/routes/views/view-quote.tsx` register intent listeners and display received context.
- `tests/e2e/intent-flow.spec.ts` verifies the contact and quote intent flow with Playwright.

## Getting started

Install dependencies:

```shell
npm install
```

Install Playwright's managed Chromium browser if it is not already installed:

```shell
npm run test:e2e:install
```

Start the app:

```shell
npm start
```

Open:

```text
http://localhost:3000
```

## Verification

Build the app:

```shell
npm run build
```

Run linting:

```shell
npm run lint
```

Run the end-to-end intent flow test:

```shell
npm run test:e2e
```

The Playwright test starts the Vite dev server automatically and validates the expected `ViewContact` and `ViewQuote` flows through the OpenFin layout iframes.

## Creating your own HERE Core web application

1. Install `@openfin/core-web`.
2. Create and serve a HERE Core manifest. See `public/manifest.json`.
3. Create and serve a layout file. See `public/default.layout.fin.json`.
4. Ensure the DOM has an element for the layout container, such as `id="layout_container"`.
5. Initialize the provider and layout. See `src/platform/provider.ts` and `src/routes/views/provider.tsx`.
6. Add app intent declarations to `public/apps.json`.

## Troubleshooting

- Ensure both `index.html` and `iframe-broker.html` are created by the bundler and linked to the right JavaScript bundles.
- Ensure the layout and manifest files are served by the web server.
- Ensure the URLs in `src/config.ts`, `public/apps.json`, and `public/default.layout.fin.json` match the dev server origin.
- Ensure the shared worker from `@openfin/core-web` is copied into `dist/assets`.
- Run `npm run test:e2e` after changing broker, layout, or intent listener code.
