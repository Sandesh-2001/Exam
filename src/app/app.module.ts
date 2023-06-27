import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestListComponent } from './components/test-list/test-list.component';
import { PortalComponent } from './components/portal/portal.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [AppComponent, TestListComponent, PortalComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
