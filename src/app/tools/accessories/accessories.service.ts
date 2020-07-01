import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccessoriesService {
  authToken: any;
  accessories = environment.accessories;
  base_uri = environment.BASE_URI;
  constructor(private http: HttpClient, private authService: AuthService) {}
  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }
  accessoriesOperations(formData) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    formData.nor_id = this.authService.getNorId();
    return this.http.post(`${this.base_uri + this.accessories}`, formData, {
      headers
    });
  }
}
