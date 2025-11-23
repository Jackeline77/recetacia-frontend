import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    component: LandingComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./routes/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./routes/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  /*{
    path: 'test-connection',
    loadComponent: () =>
      import('./components/test-connection/test-connection.component').then(
        (m) => m.TestConnectionComponent
      ),
  },*/
  {
    path: 'test-loading',
    loadComponent: () =>
      import('./components/test-loading/test-loading.component').then(
        (m) => m.TestLoadingComponent
      ),
  },
  {
    path: 'api-test',
    loadComponent: () =>
      import('./components/api-test/api-test.component').then(
        (m) => m.ApiTestComponent
      ),
  },
  // RUTAS PROTEGIDAS CON LAYOUT
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/dashboard/dashboard-home/dashboard-home.component'
          ).then((m) => m.DashboardHomeComponent),
      },
      {
        path: 'history',
        loadComponent: () =>
          import(
            './components/history/history-list/history-list.component'
          ).then((m) => m.HistoryListComponent),
      },
      {
        path: 'history/:id',
        loadComponent: () =>
          import(
            './components/history/history-detail/history-detail.component'
          ).then((m) => m.HistoryDetailComponent),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./components/favorites/favorites.component').then(
            (m) => m.FavoritesComponent
          ),
      },
      {
        path: 'recipes',
        loadComponent: () =>
          import('./components/recipes/recipes.component').then(
            (m) => m.RecipesComponent
          ),
      } /*
      {
        path: 'settings',
        loadComponent: () =>
          import('./components/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./components/help/help.component').then(
            (m) => m.HelpComponent
          ),
      },*/,
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./routes/error/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
export class AppRoutingModule {}
