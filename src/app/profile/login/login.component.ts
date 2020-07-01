import { Component, OnInit, Renderer } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '..//../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // variable
  error: String;
  show_button: Boolean = false;
  show_eye: Boolean = false;
  cookieValue = 'UNKNOWN';
  email: string;
  password: string;
  result: any;
  checked: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private cookie: CookieService,
    private toastr: ToastrService,
    private renderer: Renderer
  ) {}

  ngOnInit() {
    localStorage.removeItem('registrationUserData');
    localStorage.removeItem('equipmentData');
    localStorage.removeItem('token');
    this.renderer.setElementClass(
      document.body,
      'backgroundEmailPageImg',
      false
    );
    const _email = this.cookie.get('email');
    const _password = this.cookie.get('password');
    if (_email && _password) {
      this.email = _email;
      this.password = _password;
      this.checked = true;
    }

    const token = this.authService.decodeToken();
    if (token && token.user_type_id === 2) {
      if (token.admin_changed_pwd === 0) {
        this.router.navigate(['/change-password']);
      } else {
        this.router.navigate(['/Admin/admin-dashboard']);
      }
    } else if (token && token.user_type_id === 1) {
      this.router.navigate(['/superadmin/superadmin-dashboard']);
    } else if (token && token.user_type_id === 3) {
      if (token.admin_changed_pwd === 0) {
        this.router.navigate(['/change-password']);
      } else {
        this.router.navigate(['/tech/tech-support']);
      }
    } else if (token && token.user_type_id === 3) {
      this.router.navigate(['dashboard']);
    }
  }
  // Function

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
  onSubmit(formValue) {
    // let checkRemember = {email: "amrendra.pathak@sourcebits.com", password: "12345678", remember: false}
    this.checkRemember(formValue);
    this.userService.login(formValue.email, formValue.password).subscribe(
      (data: any) => {
        if (data.status && data.token) {
          this.authService.saveToken(data.token);
          this.userService.getProfile().subscribe(
            (userData:any)=>{
              if (userData.Status === 'Success') {
                this.userService.userProfile = userData;
                localStorage.setItem('userData', JSON.stringify(this.userService.userProfile))

                if (data.user_type_id === 2) {
                  if (data.admin_changed_pwd === 0) {
                    this.router.navigate(['/change-password']);
                  } else {
                    this.router.navigate(['/Admin/admin-dashboard']);
                  }
                } else if (data.user_type_id === 1) {
                  this.router.navigate(['/superadmin/superadmin-dashboard']);
                } else if (data.user_type_id === 3) {
                  if (data.admin_changed_pwd === 0) {
                    this.router.navigate(['/change-password']);
                  } else {
                    this.router.navigate(['/tech/tech-support']);
                  }
                } 
                else if (data.user_type_id === 4) {
                  if (data.admin_changed_pwd === 0) {
                    this.router.navigate(['/change-password']);
                  } else {
                    this.router.navigate(['/dashboard']);
                  }
                }
                else if (data.user_type_id === 0) {
                  if (data.admin_changed_pwd === 0) {
                    this.router.navigate(['/change-password']);
                  } else {
                    this.router.navigate(['/dashboard']);
                  }
                }
                else {
                  this.router.navigate(['/dashboard']);
                }
              } else {
                this.toastr.error(data.message, '', {
                  timeOut: 3000
                });
              }
            }
          )
        }else{
          this.toastr.error(data.message, '', {
            timeOut: 3000
          });
        }

      },
      err => {
        console.log('err', err);
        this.toastr.error('Please enter a valid Email or Password', '', {
          timeOut: 3000
        });
      }
    );
  }

  checkValue(f, event) {
    if (event.target.checked && f.email && f.password) {
      this.cookie.set('email', f.email);
      this.cookie.set('password', f.password);
    } else {
      this.cookie.delete('email');
      this.cookie.delete('password');
    }
  }
  checkRemember(f) {
    if (f.email != '' && f.password != '' && f.remember) {
      this.cookie.set('email', f.email);
      this.cookie.set('password', f.password);
    }
  }
}
