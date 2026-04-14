import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register').then((m) => m.Register),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./profile/profile').then((m) => m.Profile),
  },
  {
    path: 'admin/users',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./admin/admin-users/admin-users').then((m) => m.AdminUsers),
  },
  {
    path: 'accounts',
    canActivate: [authGuard],
    loadComponent: () => import('./accounts/accounts').then((m) => m.Accounts),
  },
  {
    path: 'accounts/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./transactions/transactions').then((m) => m.Transactions),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];