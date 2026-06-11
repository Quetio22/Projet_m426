import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(event: SubmitEvent, form: NgForm): void {
    event.preventDefault();
    this.errorMessage.set('');

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.authService.login(this.email, this.password).pipe(
      finalize(() => {
        this.isSubmitting.set(false);
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.status === 401
          ? 'Adresse mail ou mot de passe incorrect.'
          : 'Impossible de contacter le serveur. Réessaie plus tard.');
      }
    });
  }
}
