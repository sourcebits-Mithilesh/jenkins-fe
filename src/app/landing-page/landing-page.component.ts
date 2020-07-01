import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'nordson-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(){}
  
  navigateToSignUp(){
    this.router.navigate(['register']);
  }
  navigateToLogin(){
    this.router.navigate(['login']);
  }

}
