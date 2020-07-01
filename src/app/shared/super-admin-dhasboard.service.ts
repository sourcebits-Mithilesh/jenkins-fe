import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminDhasboardService implements OnInit {
  authToken: any;

  private url = environment.BASE_URI;
  callAdminList: Subject<string> = new Subject<string>();
  constructor(private http: HttpClient) {
    this.callAdminList.next();
  }

  ngOnInit() { }

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

  adminList(formData) {
    return this.http.get(`${this.url}/getalladmin`, this.createAuthHeader());
  }
  callAdminListToLoad() {
    this.callAdminList.next();
  }
}
