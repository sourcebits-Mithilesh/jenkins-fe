import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.decodeToken();
    // parent and sub user access
    
    if (token && (token.user_type_id === 0 || token.user_type_id === 4)) {
      return true;
    } 
    else {
      if(token)
      {
        console.log('user guard access denied')
        this.router.navigate(['access-denied'])
        return false;
      }
      else{
        console.log('user guard login')
        this.router.navigate([''])
        return false;
      }
    }
  }
}
