import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'nordson-accessdenied',
  templateUrl: './accessdenied.component.html',
  styleUrls: ['./accessdenied.component.css']
})
export class AccessdeniedComponent implements OnInit {

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit() {
  }

  openDashboard(){
    const token = this.authService.decodeToken();
    if(token && token.user_type_id === 1){
      this.router.navigate(['/superadmin/superadmin-dashboard'])
    }
    else if(token && token.user_type_id === 2){
      this.router.navigate(['/Admin/admin-dashboard'])
    }
    else if(token && token.user_type_id === 3){
      this.router.navigate(['/tech/tech-support'])
    }
    else{
      this.router.navigate(['/dashboard'])
    }
  }

}
