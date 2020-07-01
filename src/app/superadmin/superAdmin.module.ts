import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperadminDashboardComponent } from './superadmin-dashboard/superadmin-dashboard.component';
import { ShareModule } from '../share/share.module';

const routes: Routes = [
    {path:'superadmin-dashboard',component:SuperadminDashboardComponent}
]

@NgModule({
    imports: [ShareModule,RouterModule.forChild(routes)],
    exports: [],
    declarations: [SuperadminDashboardComponent],
})
export class SuperAdminModule { }