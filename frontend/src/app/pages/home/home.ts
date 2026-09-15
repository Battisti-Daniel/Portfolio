import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile';
import { ProjectService } from '../../core/services/project';
import { Profile } from '../../core/models/profile';
import { Project } from '../../core/models/project';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly profileService = inject(ProfileService);
  private readonly projectService = inject(ProjectService);

  readonly profile = signal<Profile | null>(null);
  readonly featuredProjects = signal<Project[]>([]);
  readonly loading = signal(true);

  constructor() {
    this.profileService.get().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.projectService.list().subscribe({
      next: (projects) => this.featuredProjects.set(projects.filter((p) => p.featured).slice(0, 3)),
      error: () => {},
    });
  }

  initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }
}
