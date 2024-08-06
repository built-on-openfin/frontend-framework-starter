import { Injectable } from '@angular/core';
import { App, Storefront, StorefrontFooter, StorefrontLandingPage, StorefrontNavigationSection } from '@openfin/workspace';
import { PlatformSettings } from './types';

@Injectable({ providedIn: 'root' })
export class StoreService {
  async register(platformSettings: PlatformSettings) {
    console.log('Initializing the Store provider');

    await Storefront.register({
      ...platformSettings,
      getApps(): Promise<App[]> {
        return Promise.resolve([]);
      },
      getFooter(): Promise<StorefrontFooter> {
        // @ts-ignore
        return Promise.resolve(undefined);
      },
      getLandingPage(): Promise<StorefrontLandingPage> {
        // @ts-ignore
        return Promise.resolve(undefined);
      },
      getNavigation(): Promise<
        [StorefrontNavigationSection | undefined, StorefrontNavigationSection | undefined, StorefrontNavigationSection | undefined]
      > {
        return Promise.resolve([undefined, undefined, undefined]);
      },
      launchApp(app: App): Promise<void> {
        return Promise.resolve(undefined);
      },
    });
  }

  show() {
    Storefront.show();
  }
}
