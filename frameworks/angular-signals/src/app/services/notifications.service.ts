import { Injectable } from '@angular/core';
import * as Notifications from '@openfin/workspace/notifications';
import { PlatformSettings } from './types';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  async register(platformSettings: PlatformSettings) {
    console.log('Initializing the Notifications provider');

    await Notifications.register({
      notificationsPlatformOptions: platformSettings,
    });
  }

  show() {}
}
