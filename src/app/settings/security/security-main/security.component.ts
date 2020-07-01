import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/share/language.service';

@Component({
  selector: 'nordson-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  public checked = false;
  valueLanguage: boolean = true;

  //private Router:Router

  constructor(private router: Router,private languageService: LanguageService) {}

  ngOnInit() {
    this.languageService.languageChange.subscribe(data => {
      this.valueLanguage = !this.valueLanguage;
    })
  }
  navigate() {
    this.router.navigate(['/user-management/modify-privilage']);
  }
}
