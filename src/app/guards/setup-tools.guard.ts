import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class SetupToolsGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,private toaster:ToastrService) {}
  canActivate(): boolean {
    const token = this.authService.decodeToken();
    // parent and sub user access
    if (token && (token.user_type_id === 0 || token.user_type_id === 2 || token.user_type_id === 3 || token.user_type_id === 4)) {
      console.log('norId',this.authService.getNorId())
      if(this.authService.getNorId()!=null){
        return true;
      }
      else{
        if(token.user_type_id===2){
          this.router.navigate(['Admin/admin-dashboard'])
        }
        if(token.user_type_id===0){
          this.router.navigate(['dashboard'])
        }
        if(token.user_type_id===1){
          this.router.navigate(['/superadmin/superadmin-dashboard'])
        }
        if(token.user_type_id===3){
          this.router.navigate(['/tech/tech-support'])
        }
        this.toaster.error('Access Denied! Please follow the steps to create nor file', '', {
            timeOut: 3000
        });
        return false;
      }
    } 
    else {
      if(token)
      {
        this.router.navigate(['access-denied'])
        return false;
      }
      else{
        this.router.navigate([''])
        return false;
      }
    }
  }
}
