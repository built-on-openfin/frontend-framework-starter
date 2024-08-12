import { Injectable } from '@angular/core';
import '@finos/fdc3';
import type { Context } from '@finos/fdc3';
import { Listener } from '@finos/fdc3/src/api/Listener';
import { Observable, shareReplay, Subject } from 'rxjs';

/**
 * Demonstrates the use of a general fdc3 broadcast of context
 */
@Injectable({ providedIn: 'root' })
export class ContextService {
  private contextSubject = new Subject();
  private listenerRef: Listener | null = null;

  // shareReplay operator ensures that late subscribers get the most recent context value.
  context$: Observable<any> = this.contextSubject.asObservable().pipe(shareReplay(1));

  constructor() {
    if (!window.fdc3) {
      console.error('FDC3 is not available');
    }
  }

  broadcast(context: Context): void {
    console.log('ContextService: Broadcasting fdc3 context', context);
    window.fdc3?.broadcast(context);
  }

  registerContextListener(contextType: string | null = null): void {
    if (this.listenerRef) {
      console.warn('ContextService: Listener already registered, removing old listener');
      this.removeListener();
    }
    this.listenerRef = window.fdc3?.addContextListener(contextType, (context) => {
      console.log('ContextService: received message', context);
      this.contextSubject.next(context);
    });
  }

  removeListener(): void {
    if (this.listenerRef) {
      this.listenerRef.unsubscribe();
      this.listenerRef = null;
    }
  }
}
