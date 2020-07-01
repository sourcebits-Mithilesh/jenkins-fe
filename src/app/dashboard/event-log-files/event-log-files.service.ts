import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventLogFilesService {
  private url = environment.BASE_URI;
  authToken: any;
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

  showEventLogFiles() {
    return this.http.get(`${this.url}/csvlist`, this.createAuthHeader());
  }

  downloadEventLogFile(data) {
    return this.http.post(
      `${this.url}/download/eventfile`,
      data,
      this.createAuthHeader()
    );
  }

  recentlyEventDown(fileName,userId,nor_id) {
    this.loadToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${this.authToken}`);
    return this.http.get(`${this.url}/download/eventfile?user_id=${userId}&nor_id=${nor_id}&file_name=${fileName}`,{headers,responseType: 'blob'});
  }
}
