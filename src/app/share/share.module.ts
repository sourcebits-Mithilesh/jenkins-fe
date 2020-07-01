import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../layout/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmEqualValidatorDirective, NotEqualPassword } from '../shared/confirm-equal-validator.directive';
import { MaterialModule } from '../material.module';
import { ToastrModule } from 'ngx-toastr';
import { NotificationComponent } from '../toastr-notification/toastr-notification.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomFormsModule } from 'ngx-custom-validators';
import { DashboardHeaderComponent } from '../dashboard/dashboard-header/dashboard-header.component';
import { LanguageFilterPipe } from './languageFilter.pipe';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LowercaseDirective } from './lowercase.directive';
import { DateFilterPipe } from './date-filter.pipe';
import { FooterComponent } from '../layout/footer/footer.component';

@NgModule({
   declarations: [
      HeaderComponent,
      ConfirmEqualValidatorDirective,
      NotEqualPassword,
      DashboardHeaderComponent,
      NotificationComponent,
      LanguageFilterPipe,
      SpinnerComponent,
      LowercaseDirective,
      DateFilterPipe,
      FooterComponent,
   ],
   exports: [
      CommonModule,
      FormsModule,
      ToastrModule,
      NgxPaginationModule,
      CustomFormsModule,
      ReactiveFormsModule,
      MaterialModule,
      HeaderComponent,
      ConfirmEqualValidatorDirective,
      NotEqualPassword,
      DashboardHeaderComponent,
      NotificationComponent,
      LanguageFilterPipe,
      SpinnerComponent,
      LowercaseDirective,
      DateFilterPipe,
      FooterComponent
   ],
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      NgxPaginationModule,
      CustomFormsModule,
      ToastrModule.forRoot({
         timeOut: 30000,
         positionClass: 'toast-top-right',
         preventDuplicates: true
      })
   ],
   providers:    [ LanguageFilterPipe ]
})
export class ShareModule { }
