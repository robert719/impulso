import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import {AppGuard} from "./services/app.guard";

export const AppRoutes: Routes = [
    {
  path: '',
  redirectTo: 'session/signin',
  pathMatch: 'full',
}, {
  path: '',
  component: AdminLayoutComponent,
  children: [{
    path: 'home',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  }, {
    path: 'properties',
    loadChildren: './properties/properties.module#PropertiesModule'
  }, {
    path: 'owners',
    loadChildren: './owners/owners.module#OwnersModule'
  }, {
    path: 'consultants',
    loadChildren: './consultants/consultants.module#ConsultantsModule'
  }, {
    path: 'locations',
    loadChildren: './locations/locations.module#LocationsModule'
  }, {
    path: 'pages',
    loadChildren: './pages/pages.module#PagesModule'
  }],
    canActivate: [AppGuard]
}, {
  path: '',
  component: AuthLayoutComponent,
  children: [{
    path: 'session',
    loadChildren: './session/session.module#SessionModule'
  }]
}, {
  path: '**',
  redirectTo: 'session/404'
}];
