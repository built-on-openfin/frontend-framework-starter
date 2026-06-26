import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	type OnInit,
	signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, concatMap, from, map, of, tap } from "rxjs";

@Component({
	selector: "app-provider",
	templateUrl: "./provider.component.html",
	styleUrl: "provider.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [],
})
export class ProviderComponent implements OnInit {
	message = signal<string>("");

	private destroyRef = inject(DestroyRef);

	ngOnInit() {
		if (fin) {
			from(fin.Platform.init({}))
				.pipe(
					tap(() => this.message.set("Initializing...")),
					concatMap(() => from(fin.System.getRuntimeInfo())),
					map((runtimeInfo) => this.message.set(`HERE Runtime: ${runtimeInfo.version}`)),
					takeUntilDestroyed(this.destroyRef),
					catchError((e) => {
						console.error(`Error Initializing Platform: ${e instanceof Error ? e.message : e}`);
						this.message.set("Error Initializing Platform");
						return of(false);
					}),
				)
				.subscribe();
		} else {
			this.message.set("HERE runtime is not available");
		}
	}
}
