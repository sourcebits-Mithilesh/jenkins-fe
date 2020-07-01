

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminUsersComponent,RecentUser } from './admin-users/admin-users.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ShareModule } from '../share/share.module';

const routes: Routes = [
    {path:'admin-users' ,component:AdminUsersComponent},
    {path:'admin-dashboard' ,component:AdminDashboardComponent}

]

@NgModule({
    imports: [ShareModule,RouterModule.forChild(routes)],
     exports: [],
    declarations: [AdminUsersComponent,RecentUser,AdminDashboardComponent],
    entryComponents:[RecentUser]
})
export class AdminModule { }