import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';

@Component({
  standalone: true,
  selector: 'app-view1',
  templateUrl: './view1.component.html',
  styleUrls: ['./view1.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [NotificationsService],
})
export class View1Component {
  private notificationService = inject(NotificationsService);

  showNotification(): void {
    this.notificationService.create({
      title: 'Simple Notification',
      body: 'This is a simple notification',
      toast: 'transient',
      template: 'markdown',
      buttons: [
        {
          title: 'Click me',
        },
      ],
    });
  }

  broadcastFDC3Context(): void {}

  broadcastFDC3ContextAppChannel(): void {}
}
