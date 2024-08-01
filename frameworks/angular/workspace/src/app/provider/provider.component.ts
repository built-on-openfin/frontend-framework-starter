import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { WorkspaceService } from "../services/workspace.service";

@Component({
	standalone: true,
	selector: "app-provider",
	templateUrl: "./provider.component.html",
	styleUrl: "provider.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [WorkspaceService],
	imports: [CommonModule],
})
export class ProviderComponent implements OnInit, OnDestroy {
	private workspaceService = inject(WorkspaceService);
	private unsubscribe$ = new Subject<void>();

	// Gets status messages from service and displays in template
	message$ = this.workspaceService.getStatus$();

	ngOnInit(): void {
		if (this.workspaceService.isOpenFin()) {
			this.workspaceService.init().pipe(takeUntil(this.unsubscribe$)).subscribe();
		} else {
			console.log("Not running in OpenFin");
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
