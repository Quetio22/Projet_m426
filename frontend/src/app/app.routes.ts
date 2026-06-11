import { Routes } from '@angular/router';
import { LandingPagePrincipal } from './components/landing-page-principal/landing-page-principal';
import { Login } from './components/login/login';
import { ConversationsPage } from './components/conversations-page/conversations-page';
import { Register } from './components/register/register';

export const routes: Routes = [
  { path: '', component: LandingPagePrincipal },
  { path: 'login', component: Login },
  { path: 'conversations', component: ConversationsPage },
  { path: 'register', component: Register },
];
