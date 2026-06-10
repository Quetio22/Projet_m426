import { Injectable, signal } from '@angular/core';

const AUTH_STORAGE_KEY = 'messapp_is_logged_in';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isLoggedIn = signal(this.readSavedStatus());

  login(): void {
    this.isLoggedIn.set(true);
    this.storage()?.setItem(AUTH_STORAGE_KEY, 'true');
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.storage()?.removeItem(AUTH_STORAGE_KEY);
  }

  private readSavedStatus(): boolean {
    return this.storage()?.getItem(AUTH_STORAGE_KEY) === 'true';
  }

  private storage(): Storage | null {
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
