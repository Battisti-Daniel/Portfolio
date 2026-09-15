import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Plan, PlanRequest } from '../models/plan';

@Service()
export class PlanService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  list(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.baseUrl}/plans`);
  }

  create(request: PlanRequest): Observable<Plan> {
    return this.http.post<Plan>(`${this.baseUrl}/admin/plans`, request);
  }

  update(id: number, request: PlanRequest): Observable<Plan> {
    return this.http.put<Plan>(`${this.baseUrl}/admin/plans/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/plans/${id}`);
  }
}
