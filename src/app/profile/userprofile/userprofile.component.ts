import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'nordson-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  profile: any;
  constructor(private userService: UserService) {}

  ngOnInit() {
    let userData = this.userService.setProfile()
    if(userData) {
      this.profile = userData.data;
    }
  }
}
