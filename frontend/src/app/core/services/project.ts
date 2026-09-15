import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, ProjectRequest } from '../models/project';

@Service()
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  list(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`);
  }

  create(request: ProjectRequest): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/admin/projects`, request);
  }

  update(id: number, request: ProjectRequest): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/admin/projects/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/projects/${id}`);
  }
}
