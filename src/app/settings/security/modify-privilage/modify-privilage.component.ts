import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ModifyPrivilegesService } from 'src/app/shared/modify-privileges.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { accessType } from '../../access-type-check';
import { LanguageService } from 'src/app/share/language.service';
import { LanguageFilterPipe } from 'src/app/share/languageFilter.pipe';

@Component({
  selector: 'nordson-modify-privilage',
  templateUrl: './modify-privilage.component.html',
  styleUrls: ['./modify-privilage.component.css']
})
export class ModifyPrivilageComponent implements OnInit {
  securityForm: FormGroup;
  accessType: any;
  load: boolean = false;
  valueLanguage: boolean = true;
  isNuml:boolean=true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private modifyPrivilegesService: ModifyPrivilegesService,
    private toast: ToastrService,
    private userService: UserService,
    private languageService: LanguageService,
    private languageFilterPipe: LanguageFilterPipe
  ) {}

  ngOnInit() {
    this.languageService.languageChange.subscribe(data => {
      this.valueLanguage = !this.valueLanguage;
    })
    // remove later after some time @Gaurav

    // this.securityForm = this.fb.group({
    //   TempSetpoint: [],
    //   PressureSetpoint: [],
    //   FlowTarget: [''],
    //   RecipeLoad: [''],
    //   RecipeManage: [''],
    //   TempSettings: [''],
    //   PressureSettings: [''],
    //   FlowSettings: [''],
    //   PumpSettings: [''],
    //   FillSettings: [''],
    //   Reset: [''],
    //   ComSettings: [''],
    //   SystemPreferences: [''],
    //   Scheduler: [''],
    //   IO: [''],
    //   Names: [''],
    //   SystemConfig: [''],
    //   Maintenance: [''],
    //   // new
    // });
    this.auth.getsecurityData().subscribe((data: any) => {
      if (data.status === 'Success') {
        const {result,isNuml}=data;
        this.isNuml=isNuml
        if(isNuml){
          const securityData = result;
          let obj={};
          let formObj={}
          for(let security of securityData){
            obj[security.key]=['']
            formObj[security.key]=security.value
          }
          // create form group if isNuml is true @Gaurav
          this.securityForm =this.fb.group(obj)
          this.securityForm.patchValue(formObj)
        }
        else if(!isNuml){
          const securityData = result;
          let obj={};
          let formObj={}
          for(let security of securityData){
            obj[security.key]=['']
            formObj[security.key]=security.value
          }
          // create form group if isNuml is false @Gaurav
          this.securityForm =this.fb.group(obj)
          this.securityForm.patchValue(formObj)
        }
      }
    });

    let userData = this.userService.setProfile()
    if(userData) {
      this.load = true;
      this.accessType = accessType.check(userData.data);
    }
  }
  onSubmit() {
    const formValue = this.securityForm.value;
    this.securityForm.markAsPristine();
    this.modifyPrivilegesService
      .updateSecurity(formValue)
      .subscribe((data: any) => {
        if (data.status === 'success') {
          this.toast.success(this.languageFilterPipe.transform(this.valueLanguage,'Privileges updated successfully','PRIVILEGES_UPDATED_SUCCESS'), '', {
            timeOut: 3000
          });
        }
      });
  }
}
