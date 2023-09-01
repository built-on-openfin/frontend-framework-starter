# Creating Workspace Angular App

## Generate the Angular boilerplate

```shell
npm install -g @angular/cli
ng new workspace --routing --style css
```

## Add dependencies

```shell
npm install @openfin/core @openfin/workspace @openfin/workspace-platform openfin-adapter @finos/fdc3
```

## Modify and add scripts in package.json

The `--host` switch is required for NodeJs v17+ to be able to resolve the Angular server from the OpenFin launch script. (see [https://github.com/chimurai/http-proxy-middleware#nodejs-17-econnrefused-issue-with-ipv6-and-localhost-705](https://github.com/chimurai/http-proxy-middleware#nodejs-17-econnrefused-issue-with-ipv6-and-localhost-705))

```json
"scripts": {
   "start": "ng serve --host=127.0.0.1",
   ...
   "client": "node launch.mjs http://127.0.0.1:4200/assets/platform/manifest.fin.json"
}
```

## Modify tsconfig.json

```json
{
  "compilerOptions": {
    ...
    "noImplicitReturns": false,
    "skipLibCheck": true,
    "types": ["./src/types/fin"]
  },
```

## Modify the content

- Delete `src/app/app.component.css`
- Delete `src/app/app.component.spec.ts`
- Copy `assets/index.css` to `src/styles.css`
- Copy `assets/logo.svg` to `src/assets/logo.svg`
- Copy `assets/favicon.ico` to `src/favicon.ico`
- Copy `assets/fin.d.ts` to `src/types.`
- Copy `assets/launch.mjs` to `.`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/home.ts` to `src/app/platform`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/dock.ts` to `src/app/platform`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/store.ts` to `src/app/platform`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/launch.ts` to `src/app/platform`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/notifications.ts` to `src/app/platform`
- Copy `https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter-basic/client/src/shapes.ts` to `src/app/platform`

## Update src/app-routing.module.ts

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   { path: "", loadChildren: () => import('./instructions/instructions.module').then(m => m.InstructionsModule) },
   { path: "platform/provider", loadChildren: () => import('./platform/provider.module').then(m => m.ProviderModule) },
   { path: "views/view1", loadChildren: () => import('./view1/view1.module').then(m => m.View1Module) },
   { path: "views/view2", loadChildren: () => import('./view2/view2.module').then(m => m.View2Module) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## Update src/app/app.component.html

```html
<router-outlet></router-outlet>
```

## Update src/app/app.component.ts

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Workspace';
}
```

## Update src/app/app.module.ts

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Add src/assets/platform/manifest.fin.json

```json
{
   "licenseKey": "openfin-demo-license-key",
   "runtime": {
      "arguments": "--v=1 --inspect",
      "version": "32.114.76.10"
   },
   "platform": {
      "uuid": "angular-workspace-starter",
      "icon": "http://localhost:4200/favicon.ico",
      "autoShow": true,
      "providerUrl": "http://localhost:4200/platform/provider",
      "preventQuitOnLastWindowClosed": true
   },
   "shortcut": {
      "company": "OpenFin",
      "description": "A way of showing examples of what OpenFin can do.",
      "icon": "http://localhost:4200/favicon.ico",
      "name": "Angular Workspace Starter",
      "target": ["desktop", "start-menu"]
   },
   "supportInformation": {
      "company": "OpenFin",
      "product": "Workspace Starter - Angular Workspace Starter",
      "email": "support@openfin.co",
      "forwardErrorReports": true
   },
   "customSettings": {
      "apps": [
         {
            "appId": "angular-view1",
            "name": "angular-view1",
            "title": "Angular View 1",
            "description": "Display the Angular View 1",
            "manifest": "http://localhost:4200/assets/views/view1.fin.json",
            "manifestType": "view",
            "icons": [
               {
                  "src": "http://localhost:4200/favicon.ico"
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
            "appId": "angular-view2",
            "name": "angular-view2",
            "title": "Angular View 2",
            "description": "Display the Angular View 2",
            "manifest": "http://localhost:4200/assets/views/view2.fin.json",
            "manifestType": "view",
            "icons": [
               {
                  "src": "http://localhost:4200/favicon.ico"
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

## Add src/app/platform/provider-routing.module.ts

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderComponent } from './provider.component';

const routes: Routes = [
  {
    path: '',
    component: ProviderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
```

## Add src/app/platform/provider.component.html

```html
<div class="col fill gap20">
   <header class="row spread middle">
      <div class="col">
         <h1>OpenFin Platform Window</h1>
         <h1 class="tag">Container platform window</h1>
      </div>
      <div class="row middle gap10">
         <img src="../../assets/logo.svg" alt="OpenFin" height="40px" />
      </div>
   </header>
   <main class="col gap10">
      <p>This is the platform window, which initializes the platform.</p>
      <p>The window would usually be hidden, you can make it hidden on startup by setting the platform.autoShow flag to false in the manifest.fin.json</p>
      <p>{{message}}</p>
   </main>
</div>
```

## Add src/app/platform/provider.component.ts

```ts
import { Component, NgZone } from '@angular/core';
import type OpenFin from "@openfin/core";
import { fin } from "@openfin/core";
import { Dock, Home, Storefront, type App } from "@openfin/workspace";
import { CustomActionCallerType, init } from "@openfin/workspace-platform";
import { deregisterPlatform } from "@openfin/workspace/notifications";
import { register as registerDock } from "./dock";
import { register as registerHome } from "./home";
import { launchApp } from "./launch";
import { register as registerNotifications } from "./notifications";
import type { CustomSettings, PlatformSettings } from "./shapes";
import { register as registerStore } from "./store";

@Component({
   selector: 'app-provider',
   templateUrl: './provider.component.html'
})
export class ProviderComponent {
   private _zone: NgZone;
   public message: string;

   constructor(zone: NgZone) {
      this._zone = zone;
      this.message = "";
   }

   logMessage(message: string) {
      this._zone.run(() => this.message = message);
   }

   async ngOnInit() {
      try {
         this.logMessage("Workspace platform initializing");

         // Load the settings from the manifest
         const settings = await this.getManifestCustomSettings();

         // When the platform api is ready we bootstrap the platform.
         const platform = fin.Platform.getCurrentSync();
         await platform.once("platform-api-ready", async () => {
            await this.initializeWorkspaceComponents(settings.platformSettings, settings.customSettings)
            this.logMessage("Workspace platform initialized");
         });

         // The DOM is ready so initialize the platform
         // Provide default icons and default theme for the browser windows
         await this.initializeWorkspacePlatform(settings.platformSettings);
      } catch (err) {
         this.logMessage(`Error Initializing Platform: ${err instanceof Error ? err.message : err}`);
      }
   }

   /**
 * Initialize the workspace platform.
 * @param platformSettings The platform settings from the manifest.
 */
   async initializeWorkspacePlatform(platformSettings: PlatformSettings): Promise<void> {
      this.logMessage("Initializing workspace platform");
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
   async initializeWorkspaceComponents(
      platformSettings: PlatformSettings,
      customSettings?: CustomSettings
   ): Promise<void> {
      this.logMessage("Initializing the workspace components");

      // Register with home and show it
      this.logMessage("Initializing the workspace components: home");
      await registerHome(platformSettings, customSettings?.apps);
      await Home.show();

      // Register with store
      this.logMessage("Initializing the workspace components: store");
      await registerStore(platformSettings, customSettings?.apps);

      // Register with dock
      this.logMessage("Initializing the workspace components: dock");
      await registerDock(platformSettings, customSettings?.apps);

      // Register with notifications
      this.logMessage("Initializing the workspace components: notifications");
      await registerNotifications(platformSettings);

      // When the platform requests to be close we deregister from home and quit
      const providerWindow = fin.Window.getCurrentSync();
      await providerWindow.once("close-requested", async () => {
         await Home.deregister(platformSettings.id);
         await Storefront.deregister(platformSettings.id);
         await Dock.deregister();
         await deregisterPlatform(platformSettings.id);
         await fin.Platform.getCurrentSync().quit();
      });
   }

   /**
    * Read the custom settings from the manifest.fin.json.
    * @returns The custom settings from the manifest.
    */
   async getManifestCustomSettings(): Promise<{
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
}
```

## Add src/app/platform/provider.module.ts

```ts
import { NgModule } from '@angular/core';

import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderComponent } from './provider.component';

@NgModule({
   imports: [
      ProviderRoutingModule
   ],
   declarations: [
      ProviderComponent
   ]
})
export class ProviderModule { }
```

## Add src/instructions/instructions-routing.module.ts

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstructionsComponent } from './instructions.component';


const routes: Routes = [
  {
    path: '',
    component: InstructionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructionsRoutingModule { }
```

## Add src/instructions/instructions.component.html

```html
<div id="root" class="col fill gap20">
   <header class="row spread middle">
      <div class="col">
         <h1>OpenFin Angular</h1>
         <h1 class="tag">Example demonstrating running a Angular app in an OpenFin workspace</h1>
      </div>
      <div class="row middle gap10">
         <img src="../assets/logo.svg" alt="OpenFin" height="40px" />
      </div>
   </header>
   <main class="col gap10">
      <p>To launch this application in the OpenFin container, run the following command:</p>
      <pre>npm run client</pre>
   </main>
</div>
```

## Add src/instructions/instructions.component.ts

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html'
})
export class InstructionsComponent {
}
```

## Add src/instructions/instructions.module.ts

```ts
import { NgModule } from '@angular/core';

import { InstructionsRoutingModule } from './instructions-routing.module';
import { InstructionsComponent } from './instructions.component';

@NgModule({
   imports: [
      InstructionsRoutingModule
   ],
   declarations: [
      InstructionsComponent
   ]
})
export class InstructionsModule { }
```

## Add src/app/view1/view1-routing.module.ts

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { View1Component } from './view1.component';

const routes: Routes = [
  {
    path: '',
    component: View1Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class View1RoutingModule { }
```

## Add src/app/view1/view1.component.html

```html
<div class="col fill gap20">
   <header class="row spread middle">
      <div class="col">
         <h1>OpenFin Angular View 1</h1>
         <h1 class="tag">Angular app view in an OpenFin workspace</h1>
      </div>
      <div class="row middle gap10">
         <img src="../../assets/logo.svg" alt="OpenFin" height="40px" />
      </div>
   </header>
   <main class="col gap10 left">
      <button (click)="showNotification()">Show Notification</button>
      <button (click)="broadcastFDC3Context()">Broadcast FDC3 Context</button>
      <button (click)="broadcastFDC3ContextAppChannel()">Broadcast FDC3 Context on App Channel</button>
   </main>
</div>
```

## Add src/app/view1/view1.component.ts

```ts
import { Component } from '@angular/core';
import "@finos/fdc3";
import * as Notifications from "@openfin/workspace/notifications";

@Component({
  selector: 'app-view1',
  templateUrl: './view1.component.html'
})
export class View1Component {
   async showNotification() {
      await Notifications.create({
         title: "Simple Notification",
         body: "This is a simple notification",
         toast: "transient",
         category: "default",
         template: "markdown"
      });
   }

   async broadcastFDC3Context() {
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

   async broadcastFDC3ContextAppChannel() {
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
}
```

## Add src/app/view1/view1.module.ts

```ts
import { NgModule } from '@angular/core';

import { View1RoutingModule } from './view1-routing.module';
import { View1Component } from './view1.component';

@NgModule({
   imports: [
      View1RoutingModule
   ],
   declarations: [
      View1Component
   ]
})
export class View1Module { }
```

## Add src/app/view2/view2-routing.module.ts

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { View2Component } from './view2.component';

const routes: Routes = [
  {
    path: '',
    component: View2Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class View2RoutingModule { }
```

## Add src/app/view2/view2.component.html

```html
<div class="col fill gap20">
   <header class="row spread middle">
      <div class="col">
         <h1>OpenFin Angular View 2</h1>
         <h1 class="tag">Angular app view in an OpenFin workspace</h1>
      </div>
      <div class="row middle gap10">
         <img src="../../assets/logo.svg" alt="OpenFin" height="40px" />
      </div>
   </header>
   <main class="col gap10 left width-full">
      <fieldset class="width-full">
         <label htmlFor="message">Context Received</label>
         <pre id="message" class="width-full" style="min-height:110px">{{message}}</pre>
      </fieldset>
      <button (click)="message=''">Clear</button>
   </main>
</div>
```

## Add src/app/view2/view2.component.ts

```ts
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-view2',
  templateUrl: './view2.component.html'
})
export class View2Component {
   private _zone: NgZone;
   public message: string;

   constructor(zone: NgZone) {
      this._zone = zone;
      this.message = "";
   }

   async ngOnInit() {
      await this.listenForFDC3Context();
      await this.listenForFDC3ContextAppChannel();
   }

   async listenForFDC3Context() {
      if (window.fdc3) {
         await window.fdc3.addContextListener((context) => {
            this._zone.run(() => this.message = JSON.stringify(context, undefined, "  "));
         });
      } else {
         console.error("FDC3 is not available");
      }
   }   

   async listenForFDC3ContextAppChannel() {
      if (window.fdc3) {
         const appChannel = await window.fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");

         await appChannel.addContextListener((context) => {
            this._zone.run(() => this.message = JSON.stringify(context, undefined, "  "));
         });
      } else {
         console.error("FDC3 is not available");
      }
   }   
}
```

## Add src/app/view2/view2.module.ts

```ts
import { NgModule } from '@angular/core';

import { View2RoutingModule } from './view2-routing.module';
import { View2Component } from './view2.component';

@NgModule({
   imports: [
      View2RoutingModule
   ],
   declarations: [
      View2Component
   ]
})
export class View2Module { }
```
