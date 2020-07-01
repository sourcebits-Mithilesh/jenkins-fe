import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechUserComponent, RecentUser } from './tech-user/tech-user/tech-user.component';
import { TechSupportComponent } from './tech-support/tech-support.component';
import { ShareModule } from '../share/share.module';

const routes: Routes = [
    {path:'tech-user',component:TechUserComponent},
    {path:'tech-support',component:TechSupportComponent},
]

@NgModule({
    imports: [ShareModule, RouterModule.forChild(routes)],
    exports: [],
    declarations: [TechUserComponent,RecentUser,TechSupportComponent],
    entryComponents:[RecentUser]
})
export class TechModule { }