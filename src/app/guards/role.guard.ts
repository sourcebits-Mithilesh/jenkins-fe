import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
  userData: any;
  constructor(private authService: AuthService, private route: Router) { }

  canActivate(): boolean {
    const token = this.authService.decodeToken();
    if (token && token.user_type_id === 0) {
      return true;
    }
    else {
      if (token) {
        this.route.navigate(['access-denied']);
        return false;
      }
      else {
        this.route.navigate([''])
        return false;
      }
    }
  }
}
