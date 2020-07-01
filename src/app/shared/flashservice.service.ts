import { Injectable } from '@angular/core';
import { NgFlashMessageService } from 'ng-flash-messages';

@Injectable({
  providedIn: 'root'
})
export class FlashserviceService {
  constructor(private flash: NgFlashMessageService) {}

  success(message: string) {
    this.flash.showFlashMessage({
      messages: [message],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
  }

  error(message: string) {
    this.flash.showFlashMessage({
      messages: [message],
      dismissible: true,
      timeout: 2000,
      type: 'danger'
    });
  }
}
