import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { tap, mapTo, share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Config } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authToken: any;
  private url = environment.BASE_URI;
  private endpoint = environment.validate;
  userRegData: any;
  emailData: { };
  userProfile: any;
  router: Router;
  constructor(private http: HttpClient) {}
  

  getUserByEmail(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return this.http
        .post(`${this.url}/${this.endpoint}`, { email: control.value },this.createAuthHeader())
        .pipe(
          map(
            (users: any) => {
              return users && users.status != 'Success'
                ? { uniqueEmail: true }
                : null;
            },
            err => {
              console.log('err', err);
            }
          )
        );
    };
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }
// TODO Service should hold token and avoid hitting local storage in all the case
  createAuthHeader() {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return { headers };
  }
// TODO Don't use 'String' as a type. Avoid using the `String` type and use `string`?
  login(email: String, pwd: String) {
    const userData = {
      email: email,
      pwd: pwd
    };
    return this.http.post(`${this.url}/userlogin`, userData);
  }
// TODO Use single parameter and send an object instad of two parameter so that we can directly use the object in service call
  sendEmail(email: String, full_name?: String) {
    const emailData = {
      email: email,
      full_name: full_name
    };
    return this.http.post(`${this.url}/email`, emailData,this.createAuthHeader());
  }

  forgetPassword(email) {
    return this.http.put(`${this.url}/forgetpassword`, email);
  }
  emailConfirmation(token) {
    return this.http.put(`${this.url}/emailverify/${token}`, {});
  }

  changePassword(formData, token) {
    return this.http.put(`${this.url}/resetpassword/${token}`, formData);
  }

  changePassword1(formData) {
    return this.http.post(
      `${this.url}/updatepassword`,
      formData,
      this.createAuthHeader()
    );
  }

  getSubuser() {
    return this.http.get(`${this.url}/subuser/parent`, this.createAuthHeader());
  }

  createSubuser(formData) {
    return this.http.post(
      `${this.url}/subuser/create`,
      formData,
      this.createAuthHeader()
    );
  }

  editSubuser(id) {
    return this.http.get(`${this.url}/userdetails/${id}`,this.createAuthHeader()); 
  }

  getSubuserDetails(subUserId,parentId,emailToken): Observable<HttpResponse<Config>> {
    return this.http.get(`${this.url}/sub-usr-reg-data/${subUserId}/${parentId}/${emailToken}`,{ observe: 'response' });
  }

  getProfile() {
    return this.http.get(`${this.url}/userdetails`, this.createAuthHeader());
  }
  
  setProfile() {
    const localUserData = localStorage.getItem('userData')
    if(this.userProfile) {
      return this.userProfile
    } else if(localUserData){
      this.userProfile = JSON.parse(localUserData)
      return this.userProfile
    }
    return this.userProfile
  }

  registerUser(formData): Observable<HttpResponse<Config>> {
    return this.http.post(`${this.url}/reg/user`, formData,{ observe: 'response' });
  }

  registerUser3(formData) {
    return this.http.put(`${this.url}/reg/user`, formData,this.createAuthHeader());
  }

  registerSubuser1(formData) {
    console.log(this.createAuthHeader())
    return this.http.put(`${this.url}/reg/subuser`, formData,this.createAuthHeader());
  }

  registerSubuser3(formData) {
    return this.http.put(`${this.url}/reg/subuserupdate`, formData,this.createAuthHeader());
  }

  updateSubuser(formData) {
    return this.http.put(
      `${this.url}/subuser/parent/`,
      formData,
      this.createAuthHeader()
    );
  }

  getCountries() {
    return this.http.get(`${this.url}/countries`);
  }

  updateProfile(formData) {
    return this.http.put(`${this.url}/user`, formData, this.createAuthHeader());
  }

  updateAdmin(formData) {
    return this.http.put(
      `${this.url}/editadmin`,
      formData,
      this.createAuthHeader()
    );
  }
  setRegistrationUserData(data) {
    this.userRegData = data;
  }
  getRegisteredData() {
    return this.userRegData !== undefined ? this.userRegData : JSON.parse(localStorage.getItem('registrationUserData'));
  }

  // TODO Use single parameter and send an object instad of two parameter so that we can directly use the object in service call
  validateEditEmailId(emailId,userId){
    this.emailData = {
      email: emailId
    };
    if(userId > 0){
      this.emailData = {
        email: emailId,
        user_id : userId
      };
    }
    return this.http.post(`${this.url}/emailvalidate`, this.emailData);
  }
  signUpUpdate(formData){
    return this.http.put(`${this.url}/signup-update`, formData,this.createAuthHeader());
  }
}
