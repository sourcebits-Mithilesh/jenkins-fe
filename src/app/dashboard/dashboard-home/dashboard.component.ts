import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';
import { LanguageService } from 'src/app/share/language.service';

@Component({
  selector: 'nordson-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: string;
  fullName: string;
  valueLanguage: boolean = true;
  constructor(private authService: AuthService, private userService: UserService,private languageService: LanguageService) {
    this.authService.userFUllName.subscribe(data => {
      this.fullName = data;
    });
  }

  ngOnInit() {
    this.languageService.languageChange.subscribe(data => {
      this.valueLanguage = !this.valueLanguage;
    });
    localStorage.removeItem('nor_id')
    this.display();
  }


  
  display(){
    let userData = this.userService.setProfile()
    if(userData) {
        this.user = userData.data;
        this.fullName = userData.data.full_name;
    }
  }
}
