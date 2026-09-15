import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile';

@Component({
  selector: 'app-admin-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css',
})
export class AdminProfile {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    title: ['', Validators.required],
    bio: ['', Validators.required],
    email: [''],
    location: [''],
    avatarUrl: [''],
    githubUrl: [''],
    linkedinUrl: [''],
    xUrl: [''],
  });

  constructor() {
    this.profileService.get().subscribe({
      next: (profile) => {
        this.form.patchValue({
          name: profile.name,
          title: profile.title,
          bio: profile.bio,
          email: profile.email ?? '',
          location: profile.location ?? '',
          avatarUrl: profile.avatarUrl ?? '',
          githubUrl: profile.githubUrl ?? '',
          linkedinUrl: profile.linkedinUrl ?? '',
          xUrl: profile.xUrl ?? '',
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.profileService.update(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set('Perfil atualizado com sucesso.');
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Não foi possível salvar o perfil.');
      },
    });
  }
}
