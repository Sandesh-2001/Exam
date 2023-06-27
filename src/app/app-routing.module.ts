import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestListComponent } from './components/test-list/test-list.component';
import { PortalComponent } from './components/portal/portal.component';
import { TestGuard } from './guards/test.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'test-list',
    pathMatch: 'full',
  },
  {
    path: 'test-list',
    component: TestListComponent,
    canActivate: [TestGuard],
  },
  {
    path: 'portal',
    component: PortalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
