import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  private apiUrl: string = environment.BASE_URI;
  options;
  constructor(private authService: AuthService, private http: HttpClient) {}

  getLicenseDetails() {
    this.authService.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.authToken}`
    );
    return this.http.get(`${this.apiUrl}/listlicense?nor_id=${this.authService.getNorId()}`, { headers });
  }

  addLicense(formValue) {
    this.authService.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.authToken}`
    );
    formValue.nor_id = this.authService.getNorId();
    return this.http.post(`${this.apiUrl}/addlicense`, formValue, { headers });
  }

  removeLicense(formValue) {
    this.authService.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.authToken}`
    );
    formValue.nor_id = this.authService.getNorId();
    return this.http.post(`${this.apiUrl}/removelicense`, formValue, {
      headers
    });
  }
}
