import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  userData: any;
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.decodeToken();
    if (token && token.user_type_id === 2) {
      return true;
    } 
    else {
      if(token)
      {
        console.log('error admin guard')
        this.router.navigate(['access-denied']);
        return false;
      }
      else{
        console.log('login admin guard')
        this.router.navigate(['']);
        return false;
      }
    }
  }
}
