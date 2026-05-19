import { Component, signal } from '@angular/core';
import { NavBar } from './components/nav-bar/nav-bar';
import { LandingPagePrincipal } from './components/landing-page-principal/landing-page-principal';

@Component({
  selector: 'app-root',
  imports: [NavBar, LandingPagePrincipal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
}
