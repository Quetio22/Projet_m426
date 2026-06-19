import { Routes } from '@angular/router';
import { LandingPagePrincipal } from './components/landing-page-principal/landing-page-principal';
import { Login } from './components/login/login';
import { ConversationsPage } from './components/conversations-page/conversations-page';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: LandingPagePrincipal,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'conversations',
    component: ConversationsPage,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'profile',
    component: Profile,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
