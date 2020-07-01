import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private apiUrl: string = environment.BASE_URI;
  options;
  constructor(private authService: AuthService, private http: HttpClient) {}

  updateNetwork(formValue) {
    this.authService.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.authToken}`
    );
    formValue.nor_id = this.authService.getNorId();
    return this.http.post(`${this.apiUrl}/recipe/network`, formValue, {
      headers
    });
  }
}
