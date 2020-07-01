import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user.service';
import { accessType } from 'src/app/settings/access-type-check';


@Component({
  selector: 'nordson-flow-runtime',
  templateUrl: './flow-runtime.component.html',
  styleUrls: ['./flow-runtime.component.css']
})
export class FlowRuntimeComponent implements OnInit {
  flowRuntimeForm:FormGroup
  errors:any=new Array();
  accessType: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService:UserService
  ) { }

  ngOnInit() {
    this.flowRuntimeForm = this.fb.group({
      ATSTargetAddon:['',Validators.compose([
        Validators.required
      ])]
    });

    this.authService.getxmlData()
    .subscribe((data: any) => {
      if (data.status === 'Success') {
        this.authService.setNorId(data.result.nor_id);
        const networkData = data.result.flow;
        let obj: any = {};
        for (let network in networkData) {
          obj[network] = parseInt(networkData[network].Value);
        }
        this.flowRuntimeForm.patchValue(obj);
      }
    }, (err: any) => {
      console.log('err', err);
    });
    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }

  onSubmit(){
    this.flowRuntimeForm.markAsPristine();
    const formData = this.flowRuntimeForm.getRawValue();
    for(let key in this.flowRuntimeForm.controls){
      const formKey=key;
      const formError=this.flowRuntimeForm.controls[key].errors
      if(formError){
        this.errors.push(formKey,formError)
      }
    }
    if(this.errors.length>0){
      let str='';
      let formKey='';
      const key=this.errors[0]
      formKey=key;
      if(this.errors[1].hasOwnProperty('max') || this.errors[1].hasOwnProperty('min')){
        str=`Target Add-On should be between 25 and 1000000`;
      }
      else if(this.errors[1].hasOwnProperty('required')){
        str=`Target Add-On can not be empty`;
      }
      else if(this.errors[1].hasOwnProperty('pattern')){
        str=`Invalid value for Target Add-On`;
      }
      let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
      invalidFields[1].focus();  
      this.toastr.error(`${str}`, '', {
        timeOut: 3000
      });
      this.errors=new Array()
      return;
    }

    if(formData && this.errors.length<1){
      const formVal=this.flowRuntimeForm.getRawValue()
      this.authService.submitNetworPlc(formVal)
      .subscribe((data:any)=>{
        if(data.status=='success'){
          this.toastr.success('Flow Updated Successfully', '', {
            timeOut: 3000
          });
        }
      },(err:any)=>{
        console.log('err',err)
      })
    }
  }
  preventalpha(event) {
    return this.authService.preventalpha(event);
  }
}
