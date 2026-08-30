import { Routes } from '@angular/router';
import { adminGuard } from './auth/admin.guard';
import { authGuard } from './auth/auth.guard';
import { AdminUsersPage } from './pages/admin-users-page/admin-users-page';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'register',
    component: RegisterPage,
  },
  {
    path: 'home',
    component: HomePage,
    canActivate: [authGuard],
  },
  {
    path: 'admin/users',
    component: AdminUsersPage,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
