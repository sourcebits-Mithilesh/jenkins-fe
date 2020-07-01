import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetpasswordRoutingModule } from './resetpassword-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import { ShareModule } from '../share/share.module';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    ShareModule,
    ResetpasswordRoutingModule
  ]
})
export class ResetpasswordModule { }
