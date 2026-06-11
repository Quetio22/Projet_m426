import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';

import { Login } from './login';
import { AuthService } from '../../service/auth';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            login: () => throwError(() => new HttpErrorResponse({ status: 401 }))
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the invalid credentials error visible after a 401 response', async () => {
    const emailInput = fixture.nativeElement.querySelector('#email') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('#password') as HTMLInputElement;

    emailInput.value = 'wrong@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'wrong';
    passwordInput.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.form-error');
    expect(error?.textContent).toContain('Adresse mail ou mot de passe incorrect.');
  });
});
