import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InteropService } from '../services/interop.service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  standalone: true,
  selector: 'app-view1',
  templateUrl: './view1.component.html',
  styleUrls: ['./view1.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [NotificationsService, InteropService],
})
export class View1Component {
  private notificationService = inject(NotificationsService);
  private interopService = inject(InteropService);

  showNotification(): void {
    this.notificationService.create({
      title: 'Simple Notification',
      body: 'This is a simple notification',
      toast: 'transient',
      buttons: [
        {
          title: 'Click me',
        },
      ],
    });
  }

  broadcastFDC3Context(): void {
    this.interopService.broadcast({
      type: 'fdc3.instrument',
      name: 'Microsoft Corporation',
      id: {
        ticker: 'MSFT',
      },
    });
  }

  broadcastFDC3ContextAppChannel(): void {
    // if (window.fdc3) {
    //   const appChannel = await window.fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");
    //
    //   await appChannel.broadcast({
    //     type: 'fdc3.instrument',
    //     name: 'Apple Inc.',
    //     id: {
    //       ticker: 'AAPL'
    //     }
    //   });
    // } else {
    //   console.error("FDC3 is not available");
    // }
  }
}
