import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/share/language.service';

@Component({
  selector: 'nordson-system-io',
  templateUrl: './system-io.component.html',
  styleUrls: ['./system-io.component.css']
})
export class SystemIOComponent implements OnInit {
  valueLanguage: boolean = true;
  constructor(private router: Router,private languageService: LanguageService) {}

  ngOnInit() {
    this.languageService.languageChange.subscribe(data => {
      this.valueLanguage = !this.valueLanguage;
    })
  }
  systeminput() {
    this.router.navigate(['settings/system-io/system-input']);
  }
  systemoutput() {
    this.router.navigate(['settings/system-io/system-output']);
  }
}
