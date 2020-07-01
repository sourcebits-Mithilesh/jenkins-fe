import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeComponent } from './recipe.component';
import { RecipeSettingsComponent } from './recipe-settings/recipe-settings.component';
import { ShareModule } from '../share/share.module';

const routes: Routes = [
  { path: '', component: RecipeComponent},
  { path: 'settings', component: RecipeSettingsComponent},
  
]

@NgModule({
    imports: [ShareModule, RouterModule.forChild(routes)],
    exports: [],
    declarations: [RecipeComponent,RecipeSettingsComponent],
})
export class ReciepeModule { }