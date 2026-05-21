import { Routes } from '@angular/router';
import { LandingPagePrincipal } from './components/landing-page-principal/landing-page-principal';
import { Login } from './components/login/login';

export const routes: Routes = [
  { path: '', component: LandingPagePrincipal },
  { path: 'login', component: Login },
];
