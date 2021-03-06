import {  RemultModule, NotSignedInGuard, SignedInGuard } from '@remult/angular';
import { NgModule, ErrorHandler } from '@angular/core';
import { Routes, RouterModule, Route, ActivatedRouteSnapshot } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { RegisterComponent } from './users/register/register.component';
import { UpdateInfoComponent } from './users/update-info/update-info.component';

import { UsersComponent } from './users/users.component';
import { Roles, AdminGuard } from './users/roles';
import { ShowDialogOnErrorErrorHandler } from './common/dialog';
import { RidesComponent } from './rides/rides.component';
import { PatientsComponent } from './patients/patients.component';
import { LocationsComponent } from './locations/locations.component';
// import { StamComponent } from './stam/stam.component';

const routes: Routes = [
  { path: 'Home', component: HomeComponent },
  { path: 'Rides', component: RidesComponent },
  { path: 'Patients', component: PatientsComponent },
  { path: 'Locations', component: LocationsComponent },
  { path: 'User Accounts', component: UsersComponent },
  // { path: 'Stam', component: StamComponent },

  { path: 'Register', component: RegisterComponent, canActivate: [NotSignedInGuard] },
  { path: 'Account Info', component: UpdateInfoComponent, canActivate: [SignedInGuard] },
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  { path: '**', redirectTo: '/Home', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes), RemultModule],
  providers: [AdminGuard, { provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }],
  exports: [RouterModule]
})
export class AppRoutingModule { }

