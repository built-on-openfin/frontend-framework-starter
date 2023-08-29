# Creating Container Angular App

## Generate the Angular boilerplate

```shell
npm install -g @angular/cli
ng new container
Add angular routing: Yes
Style format: Css
```

## Add dependencies

```shell
npm install @openfin/core openfin-adapter @finos/fdc3 openfin-notifications
```

## Add script to package.json

```json
"scripts": {
   ...
   "client": "node launch.mjs http://localhost:4200/platform/manifest.fin.json"
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
- Copy `assets/index.css` to `src/index.css`
- Copy `assets/logo.svg` to `src/assets/logo.svg`
- Copy `assets/favicon.ico` to `src/favicon.ico`
- Copy `assets/launch.mjs` to `.`

## Update src/app-routing.module.ts

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionsComponent } from './instructions/instructions.component';
import { ProviderComponent } from './platform/provider.component';
import { View1Component } from './view1/view1.component';
import { View2Component } from './view2/view2.component';

const routes: Routes = [
   { path: "", component: InstructionsComponent },
   { path: "platform/provider", component: ProviderComponent },
   { path: "views/view1", component: View1Component },
   { path: "views/view2", component: View2Component }
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
  title = 'container';
}
```

## Update src/app/app.module.ts

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ProviderComponent } from './platform/provider.component';
import { View1Component } from './view1/view1.component';
import { View2Component } from './view2/view2.component';

@NgModule({
  declarations: [
    AppComponent,
    ProviderComponent,
    InstructionsComponent,
    View1Component,
    View2Component
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
   "runtime": {
      "arguments": "--v=1 --inspect",
      "version": "31.112.75.4"
   },
   "platform": {
      "uuid": "react-container-starter",
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
                            "url": "http://localhost:4200/views/view2",
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
import { fin } from "@openfin/core";
import { Component } from '@angular/core';

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

## Add src/instructions/instructions.ts

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html'
})
export class InstructionsComponent {
}
```

## Add src/app/view1/view1.component.html

```html
<div class="col fill gap20">
   <header class="row spread middle">
      <div class="col">
         <h1>OpenFin React View 1</h1>
         <h1 class="tag">React app view in an OpenFin container</h1>
      </div>
      <div class="row middle gap10">
         <img src="../../assets/logo.svg" alt="OpenFin" height="40px" />
      </div>
   </header>
   <main class="col gap10 left">
      <button (click)="showNotification()">Show Notification</button>
      <button (click)="sendFDC3Context()">Send FDC3 Context</button>
   </main>
</div>
```

## Add src/app/view1/view1.component.ts

```ts
import { Component } from '@angular/core';
import "@finos/fdc3";
import * as Notifications from "openfin-notifications";

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

   async sendFDC3Context() {
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
}
```

## Add src/app/view2/view2.component.html

```html
<div class="col fill gap20">
   <header class="row spread middle">
      <div class="col">
         <h1>OpenFin React View 2</h1>
         <h1 class="tag">React app view in an OpenFin container</h1>
      </div>
      <div class="row middle gap10">
         <img src="../../assets/logo.svg" alt="OpenFin" height="40px" />
      </div>
   </header>
   <main class="col gap10 left">
      <fieldset>
         <label htmlFor="message">Context Received</label>
         <pre id="message">{{message}}</pre>
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
      if (window.fdc3) {
         await window.fdc3.addContextListener((context) => {
            this._zone.run(() => this.message = JSON.stringify(context, undefined, "  "));
         });
      } else {
         console.error("FDC3 is not available");
      }
   }
}
```
