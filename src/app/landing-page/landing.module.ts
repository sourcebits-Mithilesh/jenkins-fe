import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';
import { ShareModule } from '../share/share.module';


const routes: Routes = [
    { path: '', component: LandingPageComponent },

]

@NgModule({
    imports: [RouterModule.forChild(routes),ShareModule],
    exports: [],
    declarations: [LandingPageComponent],
})
export class LandingModule { }