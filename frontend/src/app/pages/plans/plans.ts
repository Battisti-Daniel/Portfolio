import { Component, inject, signal } from '@angular/core';
import { PlanService } from '../../core/services/plan';
import { Plan, PlanStatus } from '../../core/models/plan';

@Component({
  selector: 'app-plans',
  imports: [],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
})
export class Plans {
  private readonly planService = inject(PlanService);

  readonly plans = signal<Plan[]>([]);
  readonly loading = signal(true);

  private readonly statusLabels: Record<PlanStatus, string> = {
    PLANNED: 'Planejado',
    IN_PROGRESS: 'Em andamento',
    DONE: 'Concluído',
  };

  private readonly statusBadgeClasses: Record<PlanStatus, string> = {
    PLANNED: 'badge-info',
    IN_PROGRESS: 'badge-warning',
    DONE: 'badge-success',
  };

  private readonly statusMarkerClasses: Record<PlanStatus, string> = {
    PLANNED: 'marker-planned',
    IN_PROGRESS: 'marker-progress',
    DONE: 'marker-done',
  };

  constructor() {
    this.planService.list().subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  statusLabel(status: PlanStatus): string {
    return this.statusLabels[status];
  }

  statusClass(status: PlanStatus): string {
    return this.statusBadgeClasses[status];
  }

  markerClass(status: PlanStatus): string {
    return this.statusMarkerClasses[status];
  }
}
