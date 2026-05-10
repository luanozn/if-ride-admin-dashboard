import { Routes } from '@angular/router';
import { dashboardAuthGuard, defaultAuthGuard } from './auth-guard-default';

export const routes: Routes = [
  {
    path: '',
    canActivate: [defaultAuthGuard],
    loadComponent: () => import('../app/app').then(m => m.App)
  },
  {
    path: 'login',
    loadComponent: () => import('../core/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [dashboardAuthGuard],
    loadComponent: () => import('../features/dashboard/dashboard-root/dashboard-root').then(m => m.DashboardRoot)
  },
  { path: '**', redirectTo: '' }
];
