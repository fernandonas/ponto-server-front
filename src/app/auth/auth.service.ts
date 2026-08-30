import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from './auth.models';

const API_URL = environment.apiUrl;
const TOKEN_KEY = 'ponto_token';
const USER_KEY = 'ponto_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenState = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly userState = signal<User | null>(this.getStoredUser());

  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.tokenState()));

  get token(): string | null {
    return this.tokenState();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, credentials).pipe(
      tap((response) => this.setSession(response)),
    );
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${API_URL}/users`, data);
  }

  loadProfile(): Observable<User> {
    return this.http.get<User>(`${API_URL}/auth/me`).pipe(
      tap((user) => {
        this.userState.set(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.tokenState.set(null);
    this.userState.set(null);
    this.router.navigateByUrl('/login');
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this.tokenState.set(response.token);
    this.userState.set(response.user);
  }

  private getStoredUser(): User | null {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }
}
