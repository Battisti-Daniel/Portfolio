import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile, ProfileRequest } from '../models/profile';

@Service()
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/profile`);
  }

  update(request: ProfileRequest): Observable<Profile> {
    return this.http.put<Profile>(`${this.baseUrl}/admin/profile`, request);
  }
}
