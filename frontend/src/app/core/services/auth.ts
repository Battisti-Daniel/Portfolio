import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  token: string;
  username: string;
  expiresInMs: number;
}

const TOKEN_KEY = 'portfolio_admin_token';
const USERNAME_KEY = 'portfolio_admin_username';

@Service()
export class Auth {
  private readonly http = inject(HttpClient);

  readonly username = signal<string | null>(localStorage.getItem(USERNAME_KEY));
  readonly isAuthenticated = signal<boolean>(!!localStorage.getItem(TOKEN_KEY));

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USERNAME_KEY, response.username);
        this.username.set(response.username);
        this.isAuthenticated.set(true);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    this.username.set(null);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
