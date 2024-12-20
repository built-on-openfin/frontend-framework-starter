# Creating Container Angular App

## Generate the Angular boilerplate

```shell
npm install -g @angular/cli
ng new container --routing --style css
```

## Add dependencies

```shell
npm install @openfin/core @openfin/workspace @openfin/node-adapter @finos/fdc3
```

## Modify and add scripts in package.json

```json
"scripts": {
   ...
   "client": "node launch.mjs http://localhost:4200/assets/platform/manifest.fin.json"
}
```

## Modify angular.json

The `host` option is required for NodeJs v17+ to be able to resolve the Angular server from the OpenFin launch script. (see [https://github.com/chimurai/http-proxy-middleware#nodejs-17-econnrefused-issue-with-ipv6-and-localhost-705](https://github.com/chimurai/http-proxy-middleware#nodejs-17-econnrefused-issue-with-ipv6-and-localhost-705))

```json
"projects": {
   "container": {
      "architect": {
         "serve": {
            "options": {
               "host": "127.0.0.1"
            }
         }
      }
   }
}
```

## Modify tsconfig.json

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true
  },
```

## Modify the content

- Delete `src/app/app.component.css`
- Delete `src/app/app.component.spec.ts`
- Copy `assets/index.css` to `src/styles.css`
- Copy `assets/logo.svg` to `src/assets/logo.svg`
- Copy `assets/favicon.ico` to `src/favicon.ico`
- Copy `assets/launch.mjs` to `.`

## Update src/app.routes.ts

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
   { path: "", loadChildren: () => import('./instructions/instructions.module').then(m => m.InstructionsModule) },
   { path: "platform/provider", loadChildren: () => import('./platform/provider.module').then(m => m.ProviderModule) },
   { path: "views/view1", loadChildren: () => import('./view1/view1.module').then(m => m.View1Module) },
   { path: "views/view2", loadChildren: () => import('./view2/view2.module').then(m => m.View2Module) },
];
```

## Update src/app/app.component.html

```html
<router-outlet></router-outlet>
```

## Update src/app/app.component.ts

```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Container';
}
```

## Add src/assets/platform/manifest.fin.json

```json
{
   "runtime": {
      "arguments": "--v=1 --inspect",
      "version": "38.126.83.80"
   },
   "platform": {
      "uuid": "angular-container-starter",
      "icon": "http://localhost:4200/favicon.ico",
      "autoShow": true,
      "providerUrl": "http://localhost:4200/platform/provider"
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
                            "url": "http://localhost:4200/views/view1",
                            "name": "view1",
                            "componentName": "view",
                            "fdc3InteropApi": "2.0",
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
                            "url": "http://localhost:4200/views/view2",
                            "name": "view2",
                            "componentName": "view",
                            "fdc3InteropApi": "2.0",
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
import { Component } from '@angular/core';
import * as Notifications from "@openfin/workspace/notifications";

@Component({
   selector: 'app-provider',
   templateUrl: './provider.component.html'
})
export class ProviderComponent {
   public message: string;

   constructor() {
      this.message = "";
   }

   async ngOnInit() {
      let runtimeAvailable = false;
      if (fin) {
         try {
            await fin.Platform.init({});

            await Notifications.register({
               notificationsPlatformOptions: {
                  id: fin.me.identity.uuid,
                  title: "Angular Container Starter",
                  icon: "http://localhost:4200/favicon.ico"
               }
             });
            runtimeAvailable = true;
         } catch {
         }
      }

      if (runtimeAvailable) {
         const runtimeInfo = await fin.System.getRuntimeInfo();
         this.message = `OpenFin Runtime: ${runtimeInfo.version}`;
      } else {
         this.message = "OpenFin runtime is not available";
      }
   }
}
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
         <h1 class="tag">Example demonstrating running a Angular app in an OpenFin container</h1>
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
         <h1 class="tag">Angular app view in an OpenFin container</h1>
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
import * as Notifications from "@openfin/workspace/notifications";

@Component({
  selector: 'app-view1',
  templateUrl: './view1.component.html'
})
export class View1Component {
   async showNotification() {
      await Notifications.create({
         platform: fin.me.identity.uuid,
         title: "Simple Notification",
         body: "This is a simple notification",
         toast: "transient",
         category: "default",
         template: "markdown"
      });
   }

   async broadcastFDC3Context() {
      if (fdc3) {
         await fdc3.broadcast({
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
      if (fdc3) {
         const appChannel = await fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");

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
         <h1 class="tag">Angular app view in an OpenFin container</h1>
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
      if (fdc3) {
         await fdc3.addContextListener((context) => {
            this._zone.run(() => this.message = JSON.stringify(context, undefined, "  "));
         });
      } else {
         console.error("FDC3 is not available");
      }
   }

   async listenForFDC3ContextAppChannel() {
      if (fdc3) {
         const appChannel = await fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");

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
