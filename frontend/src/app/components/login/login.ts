import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  login(event: SubmitEvent): void {
    event.preventDefault();
    this.authService.login();
    this.router.navigate(['/']);
  }
}
