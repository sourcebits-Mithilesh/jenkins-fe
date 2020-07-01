import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { EquipmentService } from 'src/app/equipment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'nordson-signupemail',
  templateUrl: './signupemail.component.html',
  styleUrls: ['./signupemail.component.css']
})
export class SignupemailComponent implements OnInit {
  show_button: Boolean = false;
  show_eye: Boolean = false;
  show_button_reset: boolean = false;
  show_eye_reset: boolean = false;
  error = String;
  message: String;
  disabled: boolean;
  email: any;
  cemail:any;
  parentId;
  password: any;
  ccpwd: any;
  terms:any = false;
  validateTerms: boolean = false;
  backButtonLink: string='/signup'
  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private flash: NgFlashMessageService,
    private equipmentService: EquipmentService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    let emailData = this.equipmentService.getRegistrationEmailData();
    const subuserId = localStorage.getItem('subuserid');
    const tokenId=this.route.snapshot.params.token
    if (this.route.snapshot.params.parentid != undefined) {
      this.parentId = this.route.snapshot.params.parentid;
      this.backButtonLink = `${this.backButtonLink}/${subuserId}/${this.parentId}/${tokenId}`
    } else if (emailData != undefined) {
      this.parentId = emailData.parent_id;
    }
    console.log(subuserId,this.parentId,tokenId)
    if (subuserId && this.parentId) {
      this.userService.getSubuserDetails(subuserId,this.parentId,tokenId).subscribe(
        (data: any) => {
          if (data.body.status) {
            this.disabled = true;
            const user = data.body.data;
            this.email = user.email;
          }
        },
        err => {
          console.log('err', err);
        }
      );
    }
  }

  showPassword(id) {
    if (id === 'font-icon1') {
      this.show_button = !this.show_button;
      this.show_eye = !this.show_eye;
    }
    if (id === 'font-icon2') {
      this.show_button_reset = !this.show_button_reset;
      this.show_eye_reset = !this.show_eye_reset;
    }
  }
  termsChecked(eve){
    if(eve.checked == true){
this.validateTerms = true
    }else{
      this.validateTerms = false
    }
  }
  onSubmit(formValue) {
    let formData;
    if (this.parentId) {
      formData = {
        email: this.email,
        pwd: formValue.password,
        parent_user_id: this.parentId
      };
      this.userService.registerSubuser3(formData).subscribe(
        (data: any) => {
          if (data.status === 'Success') {
            localStorage.clear();
            this.clearFormData();
            this.toastr.success('User Registered Successfully', '', {
              timeOut: 3000
            });
            if(!(localStorage.getItem('currentLang'))){
              localStorage.setItem('currentLang','en-English')
            }
            this.router.navigate(['/login'])
          }
        },
        (err: any) => {
          console.error('err', err);
        }
      );
    } else {
      const userId = localStorage.getItem('id');
      const fullName = localStorage.getItem('full_name');
      formData = {
        id: userId,
        email: formValue.email,
        pwd: formValue.password
      };

      let equipmentData = this.equipmentService.getEuipmentData();
    
      
      this.userService.registerUser3(formData).subscribe(
        (data: any) => {
          if (data.status === 'Success') {
            this.equipmentService.registerEquipment(equipmentData).subscribe(
              (data: any) => {
                if (data.Status === 'Success') {
                  // this.equipmentService.setEquipmentData(data.message);
                }
              },
              (err: any) => {
                console.log('err', err);
              }
            );
            this.userService.sendEmail(formValue.email, fullName).subscribe(
              (data: any) => {
                if (data.status === 'Success') {
                  localStorage.clear();
                  this.clearFormData();
                  this.router.navigate(['/email-link']);
                }
              },
              (err: any) => {
                console.log('err', err);
              }
            );
          }
        },
        (err: any) => {
          console.log('err', err);
        }
      );
    }
  }
  clearFormData() {
    let data = '';
    this.userService.setRegistrationUserData(data);
    this.equipmentService.setEquipmentData(data);
    this.equipmentService.setRegistrationEmailData(data);
    localStorage.removeItem('equipmentSno');
    localStorage.removeItem('registrationUserData');
    localStorage.removeItem('equipmentData');
  }
}
