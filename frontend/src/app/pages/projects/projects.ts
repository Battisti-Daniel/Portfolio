import { Component, inject, signal } from '@angular/core';
import { ProjectService } from '../../core/services/project';
import { Project } from '../../core/models/project';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  private readonly projectService = inject(ProjectService);

  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);

  constructor() {
    this.projectService.list().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
