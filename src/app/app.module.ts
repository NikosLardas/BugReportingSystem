/*
    Typescript Code for the declared modules, imports and providers for the BugReporter Application
    Author: Nikos Lardas
    Created: 05.2022
*/

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BugsTableComponent } from './bugs-table/bugs-table.component';
import { BugsService } from './services/bugs.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BugsFormComponent } from './bugs-form/bugs-form.component';

@NgModule({
  declarations: [
    AppComponent,
    BugsTableComponent,
    ErrorPageComponent,
    BugsFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [BugsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
