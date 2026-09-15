import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from '../../core/services/profile';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly profileService = inject(ProfileService);

  readonly brandName = signal('Portfólio');
  readonly menuOpen = signal(false);

  constructor() {
    this.profileService.get().subscribe({
      next: (profile) => this.brandName.set(profile.name),
      error: () => {},
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
