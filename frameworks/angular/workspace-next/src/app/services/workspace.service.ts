import { inject, Injectable } from '@angular/core';
import type OpenFin from '@openfin/core';
import { fin } from '@openfin/core';
import { DockService } from './dock.service';
import { HomeService } from './home.service';
import { NotificationsService } from './notifications.service';
import { PlatformService } from './platform.service';
import { StoreService } from './store.service';
import type { CustomSettings, PlatformSettings } from './types';

/**
 * Bootstraps the OpenFin workspace
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  //
  private platformService = inject(PlatformService);
  private dockService = inject(DockService);
  private homeService = inject(HomeService);
  private notificationsService = inject(NotificationsService);
  private storeService = inject(StoreService);

  async init(): Promise<void> {
    if (!this.isOpenFin()) {
      console.warn('Not running in OpenFin');
      return;
    }

    try {
      console.log('Workspace platform initializing');

      // Load the settings from the manifest
      const settings = await this.getManifestCustomSettings();

      // When the platform api is ready we bootstrap the platform
      const platform = fin.Platform.getCurrentSync();
      await platform.once('platform-api-ready', async () => {
        await this.registerComponents(settings);

        // Show the components we want to show the user at startup (they are hidden by default)
        this.homeService.show();
        this.dockService.show();

        console.log('Workspace platform initialized');
      });

      const providerWindow = fin.Window.getCurrentSync();
      await providerWindow.once('close-requested', async () => {
        this.deregister();
        console.log('Workspace platform initialized');
      });

      // The DOM is ready so initialize the platform
      // Provide default icons and default theme for the browser windows
      await this.platformService.initializeWorkspacePlatform(settings.platformSettings);
    } catch (err) {
      console.log(`Error Initializing Platform: ${err instanceof Error ? err.message : err}`);
    }
  }

  async registerComponents({
    platformSettings,
    customSettings,
  }: {
    platformSettings: PlatformSettings;
    customSettings?: CustomSettings;
  }): Promise<void> {
    await this.dockService.register(platformSettings, customSettings?.apps);
    await this.homeService.register(platformSettings);
    await this.storeService.register(platformSettings);
    await this.notificationsService.register(platformSettings);
  }

  async deregister() {
    console.log('Deregister components');
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
        id: manifest.platform?.uuid ?? '',
        title: manifest.shortcut?.name ?? '',
        icon: manifest.platform?.icon ?? '',
      },
      customSettings: manifest.customSettings,
    };
  }

  /**
   * Helper method to determine whether we are in an OpenFin container
   */
  isOpenFin() {
    return fin.me.isOpenFin;
  }
}
