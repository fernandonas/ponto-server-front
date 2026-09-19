import { Routes } from '@angular/router';
import { adminGuard } from './auth/admin.guard';
import { authGuard } from './auth/auth.guard';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/login-page/login-page';
import { PagesLayout } from './pages/pages-layout/pages-layout';
import { RegisterPage } from './pages/register-page/register-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'home',
    component: HomePage,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: PagesLayout,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/admin-users-page/admin-users-page').then(m => m.AdminUsersPage)  ,
        data: {
          title: 'Admin - Users'
        }
      }
    ],
  },
  {
    path: 'pages',
    component: PagesLayout,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'venues',
        loadComponent: () => import('./pages/pages/venues-page/venues-page').then(m => m.VenuesPage),
        data: {
          title: 'Admin - Local'
        }
      },
      {
        path: 'match-players',
        loadComponent: () => import('./pages/pages/match-players-page/match-players-page').then(m => m.MatchPlayersPage),
        data: {
          title: 'Admin - Jogadores da partida'
        }
      },
      {
        path: 'match/:matchId/players',
        loadComponent: () => import('./pages/pages/match-players-page/match-players-page').then(m => m.MatchPlayersPage),
        data: {
          title: 'Admin - Jogadores da partida'
        }
      },
      {
        path: 'match',
        loadComponent: () => import('./pages/pages/match/match').then(m => m.Match),
        data: {
          title: 'Admin - Partidas'
        }
      }
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];
