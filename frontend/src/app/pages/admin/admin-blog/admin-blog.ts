import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BlogService } from '../../../core/services/blog';
import { BlogPostRequest, BlogPostSummary } from '../../../core/models/blog-post';

@Component({
  selector: 'app-admin-blog',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-blog.html',
  styleUrl: './admin-blog.css',
})
export class AdminBlog {
  private readonly fb = inject(FormBuilder);
  private readonly blogService = inject(BlogService);

  readonly posts = signal<BlogPostSummary[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    slug: [''],
    summary: ['', Validators.required],
    content: ['', Validators.required],
    tags: [''],
    published: [false],
  });

  constructor() {
    this.refresh();
  }

  private refresh(): void {
    this.loading.set(true);
    this.blogService.listAllForAdmin().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  edit(summary: BlogPostSummary): void {
    this.blogService.getByIdForAdmin(summary.id).subscribe({
      next: (post) => {
        this.editingId.set(post.id);
        this.form.setValue({
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          content: post.content,
          tags: post.tags.join(', '),
          published: post.published,
        });
      },
      error: () => this.errorMessage.set('Não foi possível carregar o post.'),
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ title: '', slug: '', summary: '', content: '', tags: '', published: false });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    const request: BlogPostRequest = {
      title: raw.title,
      slug: raw.slug || undefined,
      summary: raw.summary,
      content: raw.content,
      tags: raw.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      published: raw.published,
    };

    const id = this.editingId();
    const request$ = id ? this.blogService.update(id, request) : this.blogService.create(request);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelEdit();
        this.refresh();
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Não foi possível salvar o post.');
      },
    });
  }

  remove(post: BlogPostSummary): void {
    if (!confirm(`Excluir o post "${post.title}"?`)) {
      return;
    }
    this.blogService.delete(post.id).subscribe({
      next: () => this.refresh(),
      error: () => this.errorMessage.set('Não foi possível excluir o post.'),
    });
  }
}
