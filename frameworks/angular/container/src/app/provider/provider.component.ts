import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, type OnDestroy, type OnInit, signal } from "@angular/core";
import { catchError, concatMap, from, map, of, Subject, takeUntil, tap } from "rxjs";

@Component({
	selector: "app-provider",
	templateUrl: "./provider.component.html",
	styleUrl: "provider.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule],
})
export class ProviderComponent implements OnInit, OnDestroy {
	message = signal<string>("");

	private unsubscribe$ = new Subject<void>();

	ngOnInit() {
		if (fin) {
			from(fin.Platform.init({}))
				.pipe(
					tap(() => this.message.set("Initializing...")),
					concatMap(() => from(fin.System.getRuntimeInfo())),
					map((runtimeInfo) => this.message.set(`OpenFin Runtime: ${runtimeInfo.version}`)),
					takeUntil(this.unsubscribe$),
					catchError((e) => {
						console.error(`Error Initializing Platform: ${e instanceof Error ? e.message : e}`);
						this.message.set("Error Initializing Platform");
						return of(false);
					}),
				)
				.subscribe();
		} else {
			this.message.set("OpenFin runtime is not available");
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
