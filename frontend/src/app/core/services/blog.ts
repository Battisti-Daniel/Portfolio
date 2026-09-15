import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BlogPost, BlogPostRequest, BlogPostSummary } from '../models/blog-post';

@Service()
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  list(): Observable<BlogPostSummary[]> {
    return this.http.get<BlogPostSummary[]>(`${this.baseUrl}/blog`);
  }

  getBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.baseUrl}/blog/${slug}`);
  }

  listAllForAdmin(): Observable<BlogPostSummary[]> {
    return this.http.get<BlogPostSummary[]>(`${this.baseUrl}/admin/blog`);
  }

  getByIdForAdmin(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.baseUrl}/admin/blog/${id}`);
  }

  create(request: BlogPostRequest): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.baseUrl}/admin/blog`, request);
  }

  update(id: number, request: BlogPostRequest): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.baseUrl}/admin/blog/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/blog/${id}`);
  }
}
