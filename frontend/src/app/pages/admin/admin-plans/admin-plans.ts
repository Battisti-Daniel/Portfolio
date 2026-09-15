import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PlanService } from '../../../core/services/plan';
import { Plan, PlanRequest, PlanStatus } from '../../../core/models/plan';

@Component({
  selector: 'app-admin-plans',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-plans.html',
  styleUrl: './admin-plans.css',
})
export class AdminPlans {
  private readonly fb = inject(FormBuilder);
  private readonly planService = inject(PlanService);

  readonly plans = signal<Plan[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly statusOptions: { value: PlanStatus; label: string }[] = [
    { value: 'PLANNED', label: 'Planejado' },
    { value: 'IN_PROGRESS', label: 'Em andamento' },
    { value: 'DONE', label: 'Concluído' },
  ];

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    status: ['PLANNED' as PlanStatus, Validators.required],
    targetDate: [''],
    displayOrder: [0],
  });

  constructor() {
    this.refresh();
  }

  private refresh(): void {
    this.loading.set(true);
    this.planService.list().subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  edit(plan: Plan): void {
    this.editingId.set(plan.id);
    this.form.setValue({
      title: plan.title,
      description: plan.description,
      status: plan.status,
      targetDate: plan.targetDate ?? '',
      displayOrder: plan.displayOrder,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ title: '', description: '', status: 'PLANNED', targetDate: '', displayOrder: 0 });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    const request: PlanRequest = {
      title: raw.title,
      description: raw.description,
      status: raw.status,
      targetDate: raw.targetDate || null,
      displayOrder: raw.displayOrder,
    };

    const id = this.editingId();
    const request$ = id ? this.planService.update(id, request) : this.planService.create(request);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelEdit();
        this.refresh();
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Não foi possível salvar o plano.');
      },
    });
  }

  remove(plan: Plan): void {
    if (!confirm(`Excluir o plano "${plan.title}"?`)) {
      return;
    }
    this.planService.delete(plan.id).subscribe({
      next: () => this.refresh(),
      error: () => this.errorMessage.set('Não foi possível excluir o plano.'),
    });
  }

  statusLabel(status: PlanStatus): string {
    return this.statusOptions.find((o) => o.value === status)?.label ?? status;
  }
}
