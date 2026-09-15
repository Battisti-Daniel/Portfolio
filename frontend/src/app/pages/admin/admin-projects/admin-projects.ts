import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project';
import { Project, ProjectRequest } from '../../../core/models/project';

@Component({
  selector: 'app-admin-projects',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-projects.html',
  styleUrl: './admin-projects.css',
})
export class AdminProjects {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);

  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    imageUrl: [''],
    repoUrl: [''],
    demoUrl: [''],
    techStack: [''],
    featured: [false],
    displayOrder: [0],
  });

  constructor() {
    this.refresh();
  }

  private refresh(): void {
    this.loading.set(true);
    this.projectService.list().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  edit(project: Project): void {
    this.editingId.set(project.id);
    this.form.setValue({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl ?? '',
      repoUrl: project.repoUrl ?? '',
      demoUrl: project.demoUrl ?? '',
      techStack: project.techStack.join(', '),
      featured: project.featured,
      displayOrder: project.displayOrder,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ title: '', description: '', imageUrl: '', repoUrl: '', demoUrl: '', techStack: '', featured: false, displayOrder: 0 });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    const request: ProjectRequest = {
      title: raw.title,
      description: raw.description,
      imageUrl: raw.imageUrl || null,
      repoUrl: raw.repoUrl || null,
      demoUrl: raw.demoUrl || null,
      techStack: raw.techStack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      featured: raw.featured,
      displayOrder: raw.displayOrder,
    };

    const id = this.editingId();
    const request$ = id ? this.projectService.update(id, request) : this.projectService.create(request);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelEdit();
        this.refresh();
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Não foi possível salvar o projeto.');
      },
    });
  }

  remove(project: Project): void {
    if (!confirm(`Excluir o projeto "${project.title}"?`)) {
      return;
    }
    this.projectService.delete(project.id).subscribe({
      next: () => this.refresh(),
      error: () => this.errorMessage.set('Não foi possível excluir o projeto.'),
    });
  }
}
