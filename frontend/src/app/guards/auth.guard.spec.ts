import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const authService = {
    isLoggedIn: vi.fn()
  };

  beforeEach(() => {
    authService.isLoggedIn.mockReset();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    });
  });

  it('allows access when the user has a token', () => {
    authService.isLoggedIn.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    );

    expect(result).toBe(true);
  });

  it('redirects to login when the user has no token', () => {
    authService.isLoggedIn.mockReturnValue(false);
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    );

    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });
});
