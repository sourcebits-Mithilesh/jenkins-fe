import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from './language.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { catchError,map, tap } from 'rxjs/operators';

@Pipe({
  name: 'languageFilter'
})
export class LanguageFilterPipe implements PipeTransform {
  private _jsonURL = 'assets/locales/';
  constructor(private languageService: LanguageService, private http: HttpClient) { }
  transform(value: any, currentText: any, keyForLanguage) {
    if(this.languageService.respectiveLanguage[keyForLanguage] === undefined){
      return currentText;
      }
      else{
      return this.languageService.respectiveLanguage[keyForLanguage];
      }
    
  }

}
