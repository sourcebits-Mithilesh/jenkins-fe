import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map, filter } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { Config } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class SetupToolsService {
  private url = environment.BASE_URI;
  authToken: any;
  constructor(private http: HttpClient, private authService: AuthService) {}

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

  updatePreference(formData) {
    formData.nor_id = this.authService.getNorId();
    return this.http.post(
      `${this.url}/recipe/systempref`,
      formData,
      this.createAuthHeader()
    );
  }
  updateConfigurationCode(formData) {
    formData.nor_id = this.authService.getNorId();
    return this.http.post(
      `${this.url}/recipe/configcode`,
      formData,
      this.createAuthHeader()
    );
  }
  showNorFiles(page) {
    return this.http.get(`${this.url}/norfiles/`+page, this.createAuthHeader());
  }

  downloadNorFile(data) {
    return this.http.post(
      `${this.url}/user/norfile/download`,
      data,
      this.createAuthHeader()
    );
  }

  downloadNorFile1(userId,norId): Observable<HttpResponse<Config>> {
    this.loadToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${this.authToken}`);
    return this.http.get(`${this.url}/norfile/download?user_id=${userId}&nor_id=${norId}`,{headers,responseType: 'blob',observe: 'response'})
  }

  downloadPdf(){
    this.loadToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${this.authToken}`);
    return this.http.get(`${this.url}/download-pdf`,{headers,responseType: 'blob'})
  }
  downloadPdfNew(){
    this.loadToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${this.authToken}`);
    return this.http.get(`${this.url}/download-pdf-new`,{headers,responseType: 'blob'})
  }

  downloadsiemenstia(){
    this.loadToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${this.authToken}`);
    return this.http.get(`${this.url}/download-siemenstia`,{headers,responseType: 'blob'})
  }
  downloadKit(){
    this.loadToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${this.authToken}`);
    return this.http.get(`${this.url}/download-kit`,{headers,responseType: 'blob'})
  }

  norFile() {
    return this.http.get(
      `${this.url}/norfile/download`,
      this.createAuthHeader()
    );
  }

  createNorFile(formData) {
    return this.http.post(
      `${this.url}/norfile/create`,
      formData,
      this.createAuthHeader()
    );
  }

  createNorFileAdmin(formData) {
    return this.http.post(
      `${this.url}/norfile/create`,
      formData,
      this.createAuthHeader()
    );
  }

  previousNorFileCount() {
    return this.http.get(`${this.url}/useprevcount`, this.createAuthHeader());
  }

  previousNorFile(formData) {
    return this.http.post(`${this.url}/useprev`,formData, this.createAuthHeader());
  }
}
