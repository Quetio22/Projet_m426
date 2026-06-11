import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth';
import { authInterceptor } from '../interceptors/auth.interceptor';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
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
});
