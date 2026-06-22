import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from './auth';
import { authInterceptor } from '../interceptors/auth.interceptor';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('invalidates the token on the API before removing it locally', () => {
    localStorage.setItem('auth_token', 'test-token');

    service.logout().subscribe();

    const request = httpTesting.expectOne('/api/v1/tokens/me');
    expect(request.request.method).toBe('DELETE');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');

    request.flush(null, { status: 204, statusText: 'No Content' });
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('removes the local token when the logout API fails', () => {
    localStorage.setItem('auth_token', 'test-token');

    service.logout().subscribe({ error: () => {} });

    const request = httpTesting.expectOne('/api/v1/tokens/me');
    request.flush(null, { status: 500, statusText: 'Server Error' });

    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('clears the session and redirects to login after a 401 response', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    localStorage.setItem('auth_token', 'invalid-token');
    localStorage.setItem('auth_username', 'user@example.com');

    service.getCurrentUser().subscribe({ error: () => {} });

    const request = httpTesting.expectOne('/api/v1/users/me');
    expect(request.request.headers.get('Authorization')).toBe('Bearer invalid-token');
    request.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_username')).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
