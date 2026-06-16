import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/v1';
  private readonly tokenKey = 'auth_token';
  private readonly usernameKey = 'auth_username';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/tokens`, {
      username: username,
      password: password
    }).pipe(
      tap(response => {
        this.storage?.setItem(this.tokenKey, response.token);
        this.storage?.setItem(this.usernameKey, username.toLowerCase());
      })
    );
  }

  logout() {
    return this.http.delete<void>(`${this.apiUrl}/tokens/me`).pipe(
      finalize(() => {
        this.storage?.removeItem(this.tokenKey);
        this.storage?.removeItem(this.usernameKey);
      })
    );
  }

  getToken(): string | null {
    return this.storage?.getItem(this.tokenKey) ?? null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getUsername(): string | null {
    return this.storage?.getItem(this.usernameKey) ?? null;
  }

  private get storage(): Storage | null {
    if (
      typeof localStorage === 'undefined' ||
      typeof localStorage.getItem !== 'function' ||
      typeof localStorage.setItem !== 'function' ||
      typeof localStorage.removeItem !== 'function'
    ) {
      return null;
    }

    return localStorage;
  }
}
