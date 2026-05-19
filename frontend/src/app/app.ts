import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { LandingPagePrincipal } from './components/landing-page-principal/landing-page-principal';


@Component({
  selector: 'app-root',
  imports: [LandingPage, LandingPagePrincipal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
