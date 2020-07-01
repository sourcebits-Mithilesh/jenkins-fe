import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'nordson-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  countries:any;
  private url = environment.BASE_URI;
  country = null;
  option = null;
  cname: any;

  disabled: boolean;
  disabledcontact:boolean= true
  userId: any;
  parentId: number;
  email: string;
  fname: string;
  registerId: number;
  currentRegUser = false;
  address: string;
  plant: string;
  contact: number;
  selected = 'domain';
  countryCode: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  // call countries api
  ngOnInit() {
    //GetUser set data
    let getRegData = this.userService.getRegisteredData();
    if (getRegData != undefined) {
      this.fname = getRegData.full_name;
      this.cname = getRegData.company_name;
      this.option = getRegData.company_type;
      this.address =
        getRegData.company_address != undefined
          ? getRegData.company_address
          : getRegData.address;
      this.country = getRegData.country;
      this.setCountryCode(this.country);
      this.contact = getRegData.mobile_number;
      this.plant = getRegData.plant;
      //Sub - user
      this.parentId =
        getRegData.parent_user_id != undefined ? getRegData.parent_user_id : '';
      this.email = getRegData.email != undefined ? getRegData.email : '';
      this.userId =
        getRegData.subuser_id != undefined ? getRegData.subuser_id : 0;
    }
    this.getCountries()
    if (this.route.snapshot.params.subuserid != undefined) {
      this.userId = this.route.snapshot.params.subuserid;
    }
    if (this.userId) {
      const tokenId=this.route.snapshot.params.token
      const parentId=this.route.snapshot.params.parentid
      this.userService.getSubuserDetails(this.userId,parentId,tokenId).subscribe(
        (data: any) => {
          if (data.body.status) {
            const token=data.headers.get('key')
            localStorage.setItem('token',token)
            this.disabled = true; 
            const user = data.body.data;
            this.cname = user.company_name;
            this.option = user.company_type;
            this.parentId = user.parent_user_id;
            this.email = user.email;
            this.fname = user.full_name;
            localStorage.setItem('subuserid', user.id);
            localStorage.setItem('name', user.full_name);

            if(data.body.data.email_validation===1 && data.body.data.status===1) {
              this.toastr.error('You have already completed your registration', '', {
                  timeOut: 3000
              });
              this.cancel()
            }
          }
          else{
              this.toastr.error('Access Denied', '', {
                timeOut: 3000
            });
            this.cancel()
          }
        },
        err => {
          console.log('err', err);
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/login']);
  }

  getCountries(event=null){
    this.http.get(`${this.url}/countries`).subscribe(country => {
      this.countries = country['country'];
      event!=null?this.setCountryCode(event):''
    });
  }

  setCountryCode(event) {
    if(this.countries===undefined) {
      this.getCountries(event)
    } else {
      let countryDetail = this.countries.find(country => country.name == event);
      this.countryCode = '+'+countryDetail.code
    }
    this.disabledcontact = false;
  }

  onSubmit(formValue) {
    let formData;

    if (this.userId) {
      formData = {
        full_name: formValue.fname,
        country: formValue.country,
        company_name: this.cname,
        address: formValue.address,
        company_type: this.option,
        plant: formValue.plant == null ? '' : formValue.plant,
        mobile_number: formValue.contact,
        parent_user_id: this.parentId,
        email: this.email,
        subuser_id: this.userId
      };
      const tokenId=this.route.snapshot.params.token
      this.userService.registerSubuser1(formData).subscribe(
        (data: any) => {
          if (data.status === 'Success') {
            this.router.navigate(['/signup', this.userId,this.parentId,tokenId]);
            this.userService.setRegistrationUserData(formData);
            localStorage.setItem('registrationUserData', JSON.stringify(formData))
          }
          else if(data.status=="Fail"){
            this.toastr.error('User already Registered', '', {
            timeOut: 3000    
        });
        this.router.navigate(['/login']);
          }
        },
        (err: any) => {
          if(err.error.message=='User Registered'){
            this.toastr.error('User already Registered', '', {
                  timeOut: 3000
            });
            console.error('error sub user registration', err);
          }
        }
      );
    } 
    else {
      formData = {
        full_name: formValue.fname,
        country: formValue.country,
        company_name: formValue.cname,
        address: formValue.address,
        company_type: formValue.option,
        mobile_number: formValue.contact,
        plant: formValue.plant == null ? '' : formValue.plant
      };
      let api:any=this.userService.registerUser(formData)
      if(localStorage.getItem('id')){
        formData['user_id']=localStorage.getItem('id')
        api=this.userService.signUpUpdate(formData)
      }
      
      api.subscribe(
        (data: any) => {
          if(localStorage.getItem('id')){
            if (data.status === 'Success') {
              this.registerId = data.message.id;
              this.userService.setRegistrationUserData(data.message);
              localStorage.setItem('id', data.message.id);
              localStorage.setItem('full_name', data.message.full_name);
              localStorage.setItem('registrationUserData', JSON.stringify(data.message))
              this.router.navigate(['/signup']);
            }
          }
          else{
            if (data.body.status === 'Success') {
              localStorage.setItem('token',data.headers.get('key'))
              this.registerId = data.body.message.id;
              this.userService.setRegistrationUserData(data.body.message);
              localStorage.setItem('id', data.body.message.id);
              localStorage.setItem('full_name', data.body.message.full_name);
              localStorage.setItem('registrationUserData', JSON.stringify(data.body.message))
              this.router.navigate(['/signup']);
            }
          }
          
        },
        (err: any) => {
          console.log('err', err);
        }
      );
    }
  }
}
