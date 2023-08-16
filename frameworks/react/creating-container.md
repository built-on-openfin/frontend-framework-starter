# Creating Container React App

## Generate the React boilerplate

```shell
npx create-react-app@latest container --template typescript
```

## Add dependencies

```shell
npm install @openfin/core openfin-adapter @finos/fdc3 openfin-notifications react-router-dom
```

## Add script to package.json

```json
"scripts": {
   ...
   "client": "node launch.mjs"
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
               <h1 className="tag">Example demonstrating running a react app in an OpenFin container</h1>
            </div>
            <div className="row middle gap10">
               <img src={logo} alt="OpenFin" height="40px" />
            </div>
         </header>
         <main className="col gap10">
            <p>To launch this application in the OpenFin container, run the following command:</p>
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
   "runtime": {
      "arguments": "--v=1 --inspect",
      "version": "31.112.75.4"
   },
   "platform": {
      "uuid": "react-container-starter",
      "icon": "http://localhost:3000/favicon.ico",
      "autoShow": true,
      "providerUrl": "http://localhost:3000/platform/provider"
   },
   "snapshot": {
      "windows": [
         {
            "layout": {
               "content": [
                  {
                     "type": "row",
                     "content": [
                        {
                           "type": "stack",
                           "content": [
                              {
                                 "type": "component",
                                 "title": "view1",
                                 "componentName": "view",
                                 "componentState": {
                                    "url": "http://localhost:3000/views/view1",
                                    "name": "view1",
                                    "componentName": "view",
                                    "fdc3InteropApi": "1.2",
                                    "interop": {
                                       "currentContextGroup": "green"
                                    }
                                 }
                              }
                           ]
                        },
                        {
                           "type": "stack",
                           "content": [
                              {
                                 "type": "component",
                                 "title": "view2",
                                 "componentName": "view",
                                 "componentState": {
                                    "url": "http://localhost:3000/views/view2",
                                    "name": "view2",
                                    "componentName": "view",
                                    "fdc3InteropApi": "1.2",
                                    "interop": {
                                       "currentContextGroup": "green"
                                    }
                                 }
                              }
                           ]
                        }
                     ]
                  }
               ]
            }
         }
      ]
   }
}
```

## Add src/platform/Provider.tsx

```tsx
import { fin } from "@openfin/core";
import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';

function Provider() {
   const [message, setMessage] = useState("");

   useEffect(() => {
      (async function () {
         let runtimeAvailable = false;
         if (fin) {
            try {
               await fin.Platform.init({});
               runtimeAvailable = true;
            } catch {
            }
         }

         if (runtimeAvailable) {
            const runtimeInfo = await fin.System.getRuntimeInfo();
            setMessage(`OpenFin Runtime: ${runtimeInfo.version}`);
         } else {
            setMessage("OpenFin runtime is not available");
         }

      })();
   }, []);

   return (
      <div className="col fill gap20">
         <header className="row spread middle">
            <div className="col">
               <h1>OpenFin Platform Window</h1>
               <h1 className="tag">Container platform window</h1>
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

export default Provider;
```

## Add src/views/View1.tsx

```tsx
import React from 'react';
import logo from '../logo.svg';
import * as Notifications from "openfin-notifications";
import "@finos/fdc3";

function View1() {
   async function showNotification() {
      await Notifications.create({
         title: "Simple Notification",
         body: "This is a simple notification",
         toast: "transient",
         category: "default",
         template: "markdown"
      });
   }

   async function sendFDC3Context() {
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

   return (
      <div className="col fill gap20">
         <header className="row spread middle">
            <div className="col">
               <h1>OpenFin React View 1</h1>
               <h1 className="tag">React app view in an OpenFin container</h1>
            </div>
            <div className="row middle gap10">
               <img src={logo} alt="OpenFin" height="40px" />
            </div>
         </header>
         <main className="col gap10 left">
            <button onClick={() => showNotification()}>Show Notification</button>
            <button onClick={() => sendFDC3Context()}>Send FDC3 Context</button>
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
         if (window.fdc3) {
            await window.fdc3.addContextListener((context) => {
               setMessage(JSON.stringify(context, undefined, "  "));
            });
         } else {
            console.error("FDC3 is not available");
         }
      })();
   }, []);

   return (
      <div className="col fill gap20">
         <header className="row spread middle">
            <div className="col">
               <h1>OpenFin React View 2</h1>
               <h1 className="tag">React app view in an OpenFin container</h1>
            </div>
            <div className="row middle gap10">
               <img src={logo} alt="OpenFin" height="40px" />
            </div>
         </header>
         <main className="col gap10 left">
            <fieldset>
               <label htmlFor="message">Context Received</label>
               <pre id="message">{message}</pre>
            </fieldset>
            <button onClick={() => setMessage("")}>Clear</button>
         </main>
      </div>
   );
}

export default View2;
```
