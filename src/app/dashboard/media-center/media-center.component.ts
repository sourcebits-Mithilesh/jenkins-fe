import { Component, OnInit, Type } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MediaData, Pressrelease,MediaLinkData,MediaMelterData } from './media-pdf-data';
import { environment } from 'src/environments/environment';
import { SetupToolsService } from 'src/app/shared/setup-tools.service';

@Component({
  selector: 'nordson-media-center',
  templateUrl: './media-center.component.html',
  styleUrls: ['./media-center.component.css']
})
export class MediaCenterComponent implements OnInit {
  safeSrc: SafeResourceUrl;
  safeSrc1: SafeResourceUrl;
  safeSrc2: SafeResourceUrl;
  safeSrc3: SafeResourceUrl;
  safeSrc4: SafeResourceUrl;
  safeSrc5: SafeResourceUrl;
  safeSrc6: SafeResourceUrl;
  apiUrl: string = environment.BASE_URI;

  MediaLanguage: any = [{ value: 'English' }, { value: 'Dutch' }, { value: 'Portuguese' }, { value: 'Italian' }, { value: 'Spanish' }, { value: 'Japanese' }, { value: 'Chinese' }];
  mediaData: { "id": string; "count": string; "title": string; "items": { "id": string; "link": string; "lang": string; "lang-id": string; }[]; }[];
  selectedLang: string;
  Pressrelease: { "id": string; "link": string; "title": string; }[];
  MediaLinkData:{ "id": string; "link": string; "title": string; "type":string}[]; 
  MediaMelterData:{ "id": string; "link": string; "title": string; "type":string}[];

  constructor(
    private sanitizer: DomSanitizer,
    private setupService:SetupToolsService
  ) {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/IFpaPVzNhFg");
    this.safeSrc1 = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/jW5nWQotzWI");
    this.safeSrc2 = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/Q1FCHyezSxs");
    this.safeSrc3 = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/3W0cualhGAw");
    this.safeSrc4 = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/U84RTuNweNk");
    this.safeSrc5 = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/M9nE3G2fpTg");
    this.safeSrc6 = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/spJOQ4WAPj4&t=1s");

  }

  ngOnInit() {
    this.mediaData = MediaData[0]["product-manual"];
    this.Pressrelease = Pressrelease[0]["Press-releases"];
    this.MediaLinkData=MediaLinkData[0]["Media-link-Data"];
    this.MediaMelterData=MediaMelterData[0]["Media-link-Data-melter"];
    this.selectedLang = "English";
  }

  showMore() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("show-more");

    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Show more";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Show less";
      moreText.style.display = "inline";
    }
  }

  downloadPdf(link,isServer?,type?) {
    if(isServer){
      if(type==1){
        this.setupService.downloadPdf()
          .subscribe((data:any)=>{
            const blob = new Blob([data], { type: 'application/pdf' });
            saveAs(blob, `1125191_06.pdf`);
          },(err:any)=>{
            console.log('err',err);
          })
      }
      else{
        this.setupService.downloadPdfNew()
          .subscribe((data:any)=>{
            const blob = new Blob([data], { type: 'application/pdf' });
            saveAs(blob, `OEM_UI_Manual_1128647_01.pdf`);
          },(err:any)=>{
            console.log('err',err);
          })
      }
    }
    else {
      window.location.href = link;
    }
  }

  downloadsiemenstia(){
    this.setupService.downloadsiemenstia()
      .subscribe((data: any) => {
        console.log(data)
        const blob = new Blob([data], { type: 'application/zip' });
        saveAs(blob, `NordsonPBFlexSiemensTIAPortal.zip`);
      }, (err: any) => {
        console.log('err', err);
      })
  }

  downloadKit(){
    this.setupService.downloadKit()
      .subscribe((data: any) => {
        console.log(data)
        const blob = new Blob([data], { type: 'application/zip' });
        saveAs(blob, `NordsonPBFlexKit.zip`);
      }, (err: any) => {
        console.log('err', err);
      })

    }
}


