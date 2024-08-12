import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { InteropService } from '../services/interop.service';

@Component({
  standalone: true,
  selector: 'app-view2',
  templateUrl: './view2.component.html',
  styleUrls: ['./view2.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class View2Component implements OnInit, OnDestroy {
  private interopService = inject(InteropService);
  private contextSubscription: Subscription | null = null;

  message = signal<string>('');

  ngOnInit(): void {
    this.interopService.registerListener();
    this.contextSubscription = this.interopService.context$.subscribe((context) => {
      console.log('Received context:', context);
      this.message.set(JSON.stringify(context, undefined, '  '));
    });
  }

  ngOnDestroy() {
    if (this.contextSubscription) {
      this.contextSubscription.unsubscribe();
    }
    this.interopService.removeListener();
  }

  clearMessage() {
    this.message.set('');
  }
}
