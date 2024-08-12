import { Injectable } from '@angular/core';
import '@finos/fdc3';
import type { Context } from '@finos/fdc3';
import { Listener } from '@finos/fdc3/src/api/Listener';
import { Observable, shareReplay, Subject } from 'rxjs';

/**
 * Demonstrates the use of a specific app channel over fdc3
 */
@Injectable({ providedIn: 'root' })
export class ChannelService {
  private channelSubject = new Subject();
  private listenerRef: Listener | null = null;

  // shareReplay operator ensures that late subscribers get the most recent context value.
  channel$: Observable<any> = this.channelSubject.asObservable().pipe(shareReplay(1));

  constructor() {
    if (!window.fdc3) {
      console.error('FDC3 is not available');
    }
  }

  broadcast(channelName: string, context: Context): void {
    console.log('ChannelService: Broadcasting fdc3 app channel', channelName, context);
    window.fdc3?.getOrCreateChannel(channelName).then((appChannel) => {
      appChannel.broadcast(context);
    });
  }

  registerChannelListener(channelName: string, contextType: string | null = null): void {
    if (this.listenerRef) {
      console.warn('ChannelService: Listener already registered, removing old listener');
      this.removeListener();
    }
    window.fdc3?.getOrCreateChannel(channelName).then((appChannel) => {
      appChannel.addContextListener(contextType, (context) => {
        console.log('ChannelService: received message', context);
        this.channelSubject.next(context);
      });
    });
  }

  removeListener(): void {
    if (this.listenerRef) {
      this.listenerRef.unsubscribe();
      this.listenerRef = null;
    }
  }
}
