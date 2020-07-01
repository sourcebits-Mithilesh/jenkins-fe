import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechSupportService {
  authToken: any;

  private url = environment.BASE_URI;
  constructor(private http: HttpClient) {}

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

  usersCount(formData) {
    return this.http.post(
      `${this.url}/user/count`,
      formData,
      this.createAuthHeader()
    );
  }

  pendingUsersCount(formData) {
    return this.http.post(
      `${this.url}/user/count`,
      formData,
      this.createAuthHeader()
    );
  }

  norfileCount(formData) {
    return this.http.get(`${this.url}/norfile/count`, this.createAuthHeader());
  }

  logfileCount(formData) {
    return this.http.post(
      `${this.url}/admin/user/eventlog/visits`,
      formData,
      this.createAuthHeader()
    );
  }

  regStats(formData) {
    return this.http.post(
      `${this.url}/admin/regstats`,
      formData,
      this.createAuthHeader()
    );
  }

  listUsers(pageNo, formData) {
    return this.http.post(
      `${this.url}/user/search/${pageNo}`,
      formData,
      this.createAuthHeader()
    );
  }

  recentSignUps(formData) {
    return this.http.post(
      `${this.url}/user/search/:1`,
      null,
      this.createAuthHeader()
    );
  }

  blockUser(id) {
    return this.http.post(
      `${this.url}/user/block/${id}`,
      null,
      this.createAuthHeader()
    );
  }

  deleteUser(id) {
    return this.http.put(
      `${this.url}/user/${id}`,
      null,
      this.createAuthHeader()
    );
  }
}
