import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDhasboardService implements OnInit {
  authToken: any;

  private url = environment.BASE_URI;
  public selectedSortOptions;
  public userType:number;
  constructor(private http: HttpClient,private authService: AuthService) {}

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

  listUsers(pageNo, formData, selectedSortOptions=null) {
    if(selectedSortOptions!=null) {
      this.selectedSortOptions = selectedSortOptions;
    }
    return this.http.post(
      `${this.url}/user/search/${pageNo}`,
      formData,
      this.createAuthHeader()
    );
  }

  removedUsers(pageNo) {
    return this.http.get(
      `${this.url}/removedUser/${pageNo}`,
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

  unBlockUser(id) {
    return this.http.post(
      `${this.url}/user/unblock/${id}`,
      null,
      this.createAuthHeader()
    );
  }

  activateUser(id) {
    return this.http.post(
      `${this.url}/user/activate/${id}`,
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

  changeEmail(formData, user_id) {
    return this.http.post(
      `${this.url}/admin/user/changeemail/${user_id}`,
      formData,
      this.createAuthHeader()
    );
  }
  addAccountNumber(formData, user_id) {
    return this.http.post(
      `${this.url}/admin/user/addAccNo/${user_id}`,
      formData,
      this.createAuthHeader()
    );
  }

  getEquipmentNorfilesData(user_id, pageNo) {
    return this.http.post(
      `${this.url}/admin/user/equipments/norbackup/${user_id}?page=${pageNo}`,
      null,
      this.createAuthHeader()
    );
  }

  viewRecipeFiles(id, file_name, type,nor_id) {
    // return this.http.get(
    //   `${this.url}/adminrecipe/${id}?filename=${file_name}&type=${type}&nor_id=${this.authService.getNorId()}`,
    //   this.createAuthHeader()
    // );
    return this.http.get(
      `${this.url}/openrecipe?filename=${file_name}&nor_id=${nor_id}`,
      this.createAuthHeader()
    );
  }

  getUserListCsv(formData){
    return this.http.post(
      `${this.url}/export-user-list?`,
      formData,
      this.createAuthHeader()
    );
  }

}
