import { Component, inject, signal } from '@angular/core';
import { ProfileService } from '../../core/services/profile';
import { Profile } from '../../core/models/profile';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private readonly profileService = inject(ProfileService);

  readonly profile = signal<Profile | null>(null);
  readonly year = new Date().getFullYear();

  constructor() {
    this.profileService.get().subscribe({
      next: (profile) => this.profile.set(profile),
      error: () => {},
    });
  }
}
