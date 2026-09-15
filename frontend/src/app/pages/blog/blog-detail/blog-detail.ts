import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { parse } from 'marked';
import { BlogService } from '../../../core/services/blog';
import { BlogPost } from '../../../core/models/blog-post';

@Component({
  selector: 'app-blog-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly post = signal<BlogPost | null>(null);
  readonly contentHtml = signal<SafeHtml | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';

    this.blogService.getBySlug(slug).subscribe({
      next: (post) => {
        this.post.set(post);
        const html = parse(post.content) as string;
        this.contentHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }
}
