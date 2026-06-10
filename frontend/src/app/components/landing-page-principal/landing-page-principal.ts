import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing-page-principal',
  imports: [RouterLink],
  templateUrl: './landing-page-principal.html',
  styleUrl: './landing-page-principal.scss',
})
export class LandingPagePrincipal {
  private readonly authService = inject(AuthService);
  readonly isLoggedIn = this.authService.isLoggedIn;
}
