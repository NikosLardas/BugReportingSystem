/*
    Typescript Code for the BugReporter Application Routing Functionality
    Author: Nikos Lardas
    Created: 05.2022
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BugsFormComponent } from './bugs-form/bugs-form.component';
import { BugsTableComponent } from './bugs-table/bugs-table.component';
import { ErrorPageComponent } from './error-page/error-page.component';

// Routing Paths defined with corresponding components
const routes: Routes = [
  { path: '', component: BugsTableComponent },
  { path: 'addBug', component: BugsFormComponent },
  { path: 'editBug', component: BugsFormComponent},
  { path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
