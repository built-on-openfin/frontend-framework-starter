import { AsyncPipe } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	type OnDestroy,
	type OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { WorkspaceService } from "../services/workspace.service";

@Component({
	selector: "app-provider",
	template: ` <div class="col fill gap20">
		<header class="row spread middle">
			<div class="col">
				<h1>HERE Core Platform Window</h1>
				<h1 class="tag">Workspace platform window</h1>
			</div>
			<div class="row middle gap10">
				<img src="logo.svg" alt="HERE" height="40px" />
			</div>
		</header>
		<main class="col gap10">
			<p>This is the platform window, which initializes the platform.</p>
			<p>
				The window would usually be hidden, you can make it hidden on startup by setting the
				platform.autoShow flag to false in the manifest.fin.json
			</p>
			<p class="message" style="color: orange">Status: {{ message$ | async }}</p>
		</main>
	</div>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [WorkspaceService],
	imports: [AsyncPipe],
})
export class ProviderComponent implements OnInit, OnDestroy {
	private workspaceService = inject(WorkspaceService);
	private destroyRef = inject(DestroyRef);

	message$ = this.workspaceService.getStatus$();

	ngOnInit(): void {
		this.workspaceService.init().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
	}

	ngOnDestroy(): void {
		this.workspaceService.quit();
	}
}
