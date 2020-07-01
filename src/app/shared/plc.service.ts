import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlcService implements OnInit {
  private apiUrl: string = environment.BASE_URI;
  authToken: any;
  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {}

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  createAuthHeader() {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return { headers };
  }

  createAuthHeaderExport() {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return headers;
  }

  getPlc() {
    return this.http.get(`${this.apiUrl}/adi/products`,this.createAuthHeader());
  }

  saveXml(formData) {
    formData.nor_id = this.authService.getNorId();
    return this.http.post(
      `${this.apiUrl}/createxml`,
      formData,
      this.createAuthHeader()
    );
  }

  readPlc(){
    return this.http.get(`${this.apiUrl}/readplcdata?nor_id=${this.authService.getNorId()}`,this.createAuthHeader());
  }
  exportPLc(){
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.get(`${this.apiUrl}/download-flex_file?nor_id=${this.authService.getNorId()}`,{headers,responseType: 'blob'});
  }
}
