import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import  * as englishData from '../../assets/locales/en-English.json';
import  * as germenData from '../../assets/locales/de-Germen.json';
import  * as spanishData from '../../assets/locales/es-Spanish.json';
import  * as frenchData from '../../assets/locales/fr-French.json';
import  * as italianData from '../../assets/locales/it-Italian.json';
import  * as japaneseData from '../../assets/locales/ja-Japanese.json';
import  * as dutchData from '../../assets/locales/nl-Dutch.json';
import  * as portugeseData from '../../assets/locales/pt-Portuguese.json';
import  * as chineseData from '../../assets/locales/zh-Chinese.json';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private _jsonURL = 'assets/locales/';
  private dataSource = new BehaviorSubject<Boolean>(true);
  languageChange = this.dataSource.asObservable();
  respectiveLanguage:any;
  translateData = {"en-English": englishData,"de-Germen":germenData,"es-Spanish": spanishData,"fr-French": frenchData,"it-Italian":italianData,"ja-Japanese":japaneseData,"nl-Dutch":dutchData,"pt-Portuguese":portugeseData,"zh-Chinese":chineseData}
  chnageLanguage(value) {
    this.dataSource.next(value);
  }
  private currentLanguage = 'en-English';
  constructor(private http:HttpClient) {}
  languages = [
    {
      name: 'German',
      file: 'de-Germen'
    },
    {
      name: 'English',
      file: 'en-English'
    },
    {
      name: 'Spanish',
      file: 'es-Spanish'
    }
  ];
  setCurrentLanguage(value: string) {
    this.currentLanguage = value;
      localStorage.removeItem("currentLang")
      localStorage.setItem("currentLang",value);
    // this.getJsonData(value).subscribe((data)=>{
      this.respectiveLanguage=this.translateData[value].default;
      this.chnageLanguage(true);
    // })
  }
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  getJsonData(currentLang){
    return this.http.get(this._jsonURL + currentLang + '.json');
  }
  load(){
    if(localStorage.getItem("currentLang")){
      this.setCurrentLanguage(localStorage.getItem("currentLang"));
    }else{
      this.setCurrentLanguage('en-English');
    }
    
  }

}
