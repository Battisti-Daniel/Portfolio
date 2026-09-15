import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../core/services/blog';
import { BlogPostSummary } from '../../../core/models/blog-post';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css',
})
export class BlogList {
  private readonly blogService = inject(BlogService);

  readonly posts = signal<BlogPostSummary[]>([]);
  readonly loading = signal(true);

  constructor() {
    this.blogService.list().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
