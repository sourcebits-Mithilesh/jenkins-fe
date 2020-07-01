import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlcMappingComponent } from './plc-mapping.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { ShareModule } from 'src/app/share/share.module';

const routes: Routes = [
    { path: '',
    component: PlcMappingComponent,}
]

@NgModule({
    
    imports: [ShareModule,NgDragDropModule.forRoot(),RouterModule.forChild(routes)],
    exports: [ShareModule],
    declarations: [PlcMappingComponent],
})
export class PlcModule { }