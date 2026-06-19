import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';

export interface UserProfile {
  id: number;
  username: string;
  displayName: string | null;
  _links?: {
    self?: {
      href: string;
    };
    conversations?: {
      href: string;
    };
  };
}

export interface UserUpdate {
  username?: string;
  displayName?: string;
  password?: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = '/api/v1';
  private readonly tokenKey = 'auth_token';
  private readonly usernameKey = 'auth_username';

  constructor(private readonly http: HttpClient) {}

  login(
    username: string,
    password: string,
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/tokens`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.usernameKey, username);
        }),
      );
  }

  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.apiUrl}/users/me`,
    );
  }

  updateCurrentUser(
    update: UserUpdate,
  ): Observable<UserProfile> {
    return this.http.patch<UserProfile>(
      `${this.apiUrl}/users/me`,
      update,
    );
  }

  logout(): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/tokens/me`)
      .pipe(
        finalize(() => {
          this.clearSession();
        }),
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
  }
}