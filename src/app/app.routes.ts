import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { LoginComponent } from '../core/auth/login/login.component';
import { App } from './app';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('../app/app').then(m => m.App)
  },
  {
    path: 'login',
    loadComponent: () => import('../core/auth/login/login.component').then(m => m.LoginComponent)
  },
  { path: '**', redirectTo: '' }
];
