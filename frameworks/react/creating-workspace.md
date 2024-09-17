# Creating Workspace React App

## Generate the React boilerplate

```shell
npx create-react-app@latest workspace --template typescript
```

## Add dependencies

```shell
npm install @openfin/core @openfin/workspace @openfin/workspace-platform @openfin/node-adapter @finos/fdc3 react-router-dom
```

## Add script to package.json

```json
"scripts": {
   ...
   "client": "node launch.mjs http://localhost:3000/platform/manifest.fin.json"
}
```

## Modify the content

- Delete `src/App.css`
- Delete `src/App.test.tsx`
- Delete `src/reportWebVitals.ts`
- Delete `src/setupTests.ts`
- Copy `assets/index.css` to `src/index.css`
- Copy `assets/logo.svg` to `src/logo.svg`
- Copy `assets/favicon.ico` to `public/favicon.ico`
- Copy `assets/logo192.png` to `public/logo192.png`
- Copy `assets/logo512.png` to `public/logo512.png`
- Copy `assets/launch.mjs` to `.`
- Copy `assets/fin.d.ts` to `src`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/home.ts` to `src/platform`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/dock.ts` to `src/platform`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/store.ts` to `src/platform`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/launch.ts` to `src/platform`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/notifications.ts` to `src/platform`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/shapes.ts` to `src/platform`

## Add .env

```shell
GENERATE_SOURCEMAP=false
```

## Update src/index.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import './index.css';

const Provider = React.lazy(() => import('./platform/Provider'));
const View1 = React.lazy(() => import('./views/View1'));
const View2 = React.lazy(() => import('./views/View2'));

const root = ReactDOM.createRoot(
   document.getElementById('root') as HTMLElement
);
root.render(
   <React.StrictMode>
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/views/view1" element={<View1 />}></Route>
            <Route path="/views/view2" element={<View2 />}></Route>
            <Route path="/platform/provider" element={<Provider />}></Route>
         </Routes>
      </BrowserRouter>
   </React.StrictMode>
);
```

## Update src/App.tsx

```tsx
import React from 'react';
import logo from './logo.svg';

function App() {
   return (
      <div className="col fill gap20">
         <header className="row spread middle">
            <div className="col">
               <h1>OpenFin React</h1>
               <h1 className="tag">Example demonstrating running a react app in an OpenFin workspace</h1>
            </div>
            <div className="row middle gap10">
               <img src={logo} alt="OpenFin" height="40px" />
            </div>
         </header>
         <main className="col gap10">
            <p>To launch this application in the OpenFin workspace, run the following command:</p>
            <pre>npm run client</pre>
         </main>
      </div>
   );
}

export default App;
```

## Add public/platform/manifest.fin.json

```json
 {
   "licenseKey": "openfin-demo-license-key",
   "runtime": {
      "arguments": "--v=1 --inspect",
      "version": "36.122.80.11"
   },
   "platform": {
      "uuid": "react-workspace-starter",
      "icon": "http://localhost:3000/favicon.ico",
      "autoShow": true,
      "providerUrl": "http://localhost:3000/platform/provider",
      "preventQuitOnLastWindowClosed": true
   },
   "shortcut": {
      "company": "OpenFin",
      "description": "A way of showing examples of what OpenFin can do.",
      "icon": "http://localhost:3000/favicon.ico",
      "name": "React Workspace Starter",
      "target": ["desktop", "start-menu"]
   },
   "supportInformation": {
      "company": "OpenFin",
      "product": "Workspace Starter - React Workspace Starter",
      "email": "support@openfin.co",
      "forwardErrorReports": true
   },
   "customSettings": {
      "apps": [
         {
            "appId": "react-view1",
            "name": "react-view1",
            "title": "React View 1",
            "description": "Display the React View 1",
            "manifest": "http://localhost:3000/views/view1.fin.json",
            "manifestType": "view",
            "icons": [
               {
                  "src": "http://localhost:3000/favicon.ico"
               }
            ],
            "contactEmail": "contact@example.com",
            "supportEmail": "support@example.com",
            "publisher": "OpenFin",
            "intents": [],
            "images": [
            ],
            "tags": ["view", "openfin"]
         },
         {
            "appId": "react-view2",
            "name": "react-view2",
            "title": "React View 2",
            "description": "Display the React View 2",
            "manifest": "http://localhost:3000/views/view2.fin.json",
            "manifestType": "view",
            "icons": [
               {
                  "src": "http://localhost:3000/favicon.ico"
               }
            ],
            "contactEmail": "contact@example.com",
            "supportEmail": "support@example.com",
            "publisher": "OpenFin",
            "intents": [],
            "images": [
            ],
            "tags": ["view", "openfin"]
         }
      ]
   }
}
```

## Add src/platform/Provider.tsx

```tsx
import type OpenFin from "@openfin/core";
import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';
import { Dock, Home, Storefront, type App } from "@openfin/workspace";
import { CustomActionCallerType, init } from "@openfin/workspace-platform";
import * as Notifications from "@openfin/workspace/notifications";
import { register as registerDock } from "./dock";
import { register as registerHome } from "./home";
import { launchApp } from "./launch";
import { register as registerNotifications } from "./notifications";
import type { CustomSettings, PlatformSettings } from "./shapes";
import { register as registerStore } from "./store";

let isInitialized = false;
let logMessage: React.Dispatch<React.SetStateAction<string>>;

function Provider() {
   const [message, setMessage] = useState("");

   logMessage = setMessage;

   useEffect(() => {
      (async function () {
         if (!isInitialized) {
            isInitialized = true;
            try {
               setMessage("Workspace platform initializing");

               // Load the settings from the manifest
               const settings = await getManifestCustomSettings();

               // When the platform api is ready we bootstrap the platform.
               const platform = fin.Platform.getCurrentSync();
               await platform.once("platform-api-ready", async () => {
                  await initializeWorkspaceComponents(settings.platformSettings, settings.customSettings)
                  setMessage("Workspace platform initialized");
               });

               // The DOM is ready so initialize the platform
               // Provide default icons and default theme for the browser windows
               await initializeWorkspacePlatform(settings.platformSettings);
            } catch (err) {
               setMessage(`Error Initializing Platform: ${err instanceof Error ? err.message : err}`)
            }
         }
      })();
   }, []);

   return (
      <div className="col fill gap20">
         <header className="row spread middle">
            <div className="col">
               <h1>OpenFin Platform Window</h1>
               <h1 className="tag">Workspace platform window</h1>
            </div>
            <div className="row middle gap10">
               <img src={logo} alt="OpenFin" height="40px" />
            </div>
         </header>
         <main className="col gap10">
            <p>This is the platform window, which initializes the platform.</p>
            <p>The window would usually be hidden, you can make it hidden on startup by setting the platform.autoShow flag to false in the manifest.fin.json</p>
            <p>{message}</p>
         </main>
      </div>
   );
}

/**
 * Initialize the workspace platform.
 * @param platformSettings The platform settings from the manifest.
 */
async function initializeWorkspacePlatform(platformSettings: PlatformSettings): Promise<void> {
   logMessage("Initializing workspace platform");
   await init({
      browser: {
         defaultWindowOptions: {
            icon: platformSettings.icon,
            workspacePlatform: {
               pages: [],
               favicon: platformSettings.icon
            }
         }
      },
      theme: [
         {
            label: "Default",
            default: "dark",
            palette: {
               brandPrimary: "#0A76D3",
               brandSecondary: "#383A40",
               backgroundPrimary: "#1E1F23"
            }
         }
      ],
      customActions: {
         "launch-app": async (e): Promise<void> => {
            if (
               e.callerType === CustomActionCallerType.CustomButton ||
               e.callerType === CustomActionCallerType.CustomDropdownItem
            ) {
               await launchApp(e.customData as App);
            }
         }
      }
   });
}

/**
 * Bring the platform to life.
 * @param platformSettings The platform settings from the manifest.
 * @param customSettings The custom settings from the manifest.
 */
async function initializeWorkspaceComponents(
   platformSettings: PlatformSettings,
   customSettings?: CustomSettings
): Promise<void> {
   logMessage("Initializing the workspace components");

   // Register with home and show it
   logMessage("Initializing the workspace components: home");
   await registerHome(platformSettings, customSettings?.apps);
   await Home.show();

   // Register with store
   logMessage("Initializing the workspace components: store");
   await registerStore(platformSettings, customSettings?.apps);

   // Register with dock
   logMessage("Initializing the workspace components: dock");
   await registerDock(platformSettings, customSettings?.apps);

   // Register with notifications
   logMessage("Initializing the workspace components: notifications");
   await registerNotifications(platformSettings);

   // When the platform requests to be close we deregister from home and quit
   const providerWindow = fin.Window.getCurrentSync();
   await providerWindow.once("close-requested", async () => {
      await Home.deregister(platformSettings.id);
      await Storefront.deregister(platformSettings.id);
      await Dock.deregister();
      await Notifications.deregister(platformSettings.id);
      await fin.Platform.getCurrentSync().quit();
   });
}

/**
 * Read the custom settings from the manifest.fin.json.
 * @returns The custom settings from the manifest.
 */
async function getManifestCustomSettings(): Promise<{
   platformSettings: PlatformSettings;
   customSettings?: CustomSettings;
}> {
   // Get the manifest for the current application
   const app = await fin.Application.getCurrent();

   // Extract the custom settings for this application
   const manifest: OpenFin.Manifest & { customSettings?: CustomSettings } = await app.getManifest();
   return {
      platformSettings: {
         id: manifest.platform?.uuid ?? "",
         title: manifest.shortcut?.name ?? "",
         icon: manifest.platform?.icon ?? ""
      },
      customSettings: manifest.customSettings
   };
}

export default Provider;
```

## Add src/views/View1.tsx

```tsx
import { fin } from "@openfin/core";
import React from 'react';
import logo from '../logo.svg';
import * as Notifications from "@openfin/workspace/notifications";
import "@finos/fdc3";

function View1() {
   async function showNotification() {
      await Notifications.create({
         platform: fin.me.identity.uuid,
         title: "Simple Notification",
         body: "This is a simple notification",
         toast: "transient",
         category: "default",
         template: "markdown"
      });
   }

   async function broadcastFDC3Context() {
      if (window.fdc3) {
         await window.fdc3.broadcast({
            type: 'fdc3.instrument',
            name: 'Microsoft Corporation',
            id: {
               ticker: 'MSFT'
            }
         });
      } else {
         console.error("FDC3 is not available");
      }
   }

   async function broadcastFDC3ContextAppChannel() {
      if (window.fdc3) {
         const appChannel = await window.fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");

         await appChannel.broadcast({
            type: 'fdc3.instrument',
            name: 'Apple Inc.',
            id: {
               ticker: 'AAPL'
            }
         });
      } else {
         console.error("FDC3 is not available");
      }
   }

   return (
      <div className="col fill gap20">
         <header className="row spread middle">
            <div className="col">
               <h1>OpenFin React View 1</h1>
               <h1 className="tag">React app view in an OpenFin workspace</h1>
            </div>
            <div className="row middle gap10">
               <img src={logo} alt="OpenFin" height="40px" />
            </div>
         </header>
         <main className="col gap10 left">
            <button onClick={() => showNotification()}>Show Notification</button>
            <button onClick={() => broadcastFDC3Context()}>Broadcast FDC3 Context</button>
            <button onClick={() => broadcastFDC3ContextAppChannel()}>Broadcast FDC3 Context on App Channel</button>
         </main>
      </div>
   );
}

export default View1;
```

## Add src/views/View2.tsx

```tsx
import "@finos/fdc3";
import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';

function View2() {
   const [message, setMessage] = useState("");

   useEffect(() => {
      (async function () {
         await listenForFDC3Context();
         await listenForFDC3ContextAppChannel();
      })();
   }, []);

   async function listenForFDC3Context() {
      if (window.fdc3) {
         await window.fdc3.addContextListener((context) => {
            setMessage(JSON.stringify(context, undefined, "  "));
         });
      } else {
         console.error("FDC3 is not available");
      }
   }   

   async function listenForFDC3ContextAppChannel() {
      if (window.fdc3) {
         const appChannel = await window.fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");

         await appChannel.addContextListener((context) => {
            setMessage(JSON.stringify(context, undefined, "  "));
         });
      } else {
         console.error("FDC3 is not available");
      }
   }   

   return (
      <div className="col fill gap20">
         <header className="row spread middle">
            <div className="col">
               <h1>OpenFin React View 2</h1>
               <h1 className="tag">React app view in an OpenFin workspace</h1>
            </div>
            <div className="row middle gap10">
               <img src={logo} alt="OpenFin" height="40px" />
            </div>
         </header>
         <main className="col gap10 left width-full">
            <fieldset className="width-full">
               <label htmlFor="message">Context Received</label>
               <pre id="message" className="width-full" style={{minHeight:"110px"}}>{message}</pre>
            </fieldset>
            <button onClick={() => setMessage("")}>Clear</button>
         </main>
      </div>
   );
}

export default View2;
```
