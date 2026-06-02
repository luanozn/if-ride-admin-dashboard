import { Routes } from '@angular/router';
import { dashboardAuthGuard, defaultAuthGuard } from './auth-guard-default';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [defaultAuthGuard],
    loadComponent: () => import('../core/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [dashboardAuthGuard], // Protege o sistema. Se não tiver token, joga pro login.
    loadComponent: () => import('../core/layout-container/layout-container').then(m => m.LayoutContainer),
    children: [
      { path: '', redirectTo: 'applications', pathMatch: 'full' },
      {
        path: 'applications',
        loadComponent: () => import('../features/applications/application-list/application-list').then(m => m.ApplicationList)
      },
      {
        path: 'administradores',
        loadComponent: () => import('../features/administradores/administradores').then(m => m.Administradores)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
