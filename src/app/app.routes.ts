import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';

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
    path: 'test-connection',
    loadComponent: () =>
      import('./components/test-connection/test-connection.component').then(
        (m) => m.TestConnectionComponent
      ),
  },
  {
    path: '404',
    loadComponent: () => import('./routes/error/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
export class AppRoutingModule {}
