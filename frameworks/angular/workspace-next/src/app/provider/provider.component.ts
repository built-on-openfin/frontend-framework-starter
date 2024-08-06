import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { WorkspaceService } from '../services/workspace.service';

@Component({
  standalone: true,
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WorkspaceService],
})
export class ProviderComponent implements OnInit {
  private workspaceService = inject(WorkspaceService);

  ngOnInit(): void {
    this.workspaceService.init();
  }
}
