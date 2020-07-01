import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  authToken: any;
  recipelist = environment.recipeList;
  base_uri = environment.BASE_URI;
  openrecipe = environment.openRecipe;
  createRecipe = environment.createRecipe;
  renameRecipe = environment.renameRecipe;
  updatePressure = environment.updatePressure;
  updateTemperature = environment.updateTempzone;
  recipeExport = environment.exportRecipe;
  createNewRecipe = environment.createNewRecipe;
  defaultData = environment.defaultRecipeData;
  importxml = environment.importxmlFile;
  openRecipeFile: string;
  userId: number;
  recipeListObject: any;
  convertTempApi = environment.tempConvert;
  convertPressureApi = environment.pressureConvert;
  lineSpeedconvertApi=environment.lineSpeedConvert;
  deleteRecipeApi = environment.deleteRecipe;
  constructor(
    private http: HttpClient,
    public router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {}
  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }
  getRecipeList() {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.get(`${this.base_uri + this.recipelist}?nor_id=${this.authService.getNorId()}`, { headers });
  }
  getOpenRecipeData(filename) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.get(
      `${this.base_uri + this.openrecipe + '?filename=' + filename + '.xml&nor_id=' + this.authService.getNorId()}`,
      { headers }
    );
  }
  setOpenRecipe(openRecipe) {
    this.openRecipeFile = openRecipe;
    localStorage.setItem('openRecipeFile', this.openRecipeFile);
  }
  getOpenRecipe() {
    console.log('get recipe data', localStorage.getItem('openRecipeFile'));
    if (this.openRecipeFile == '' || this.openRecipeFile == undefined) {
      return localStorage.getItem('openRecipeFile');
    } else {
      return this.openRecipeFile;
    }
  }
  getCreateRecipe() {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.get(`${this.base_uri + this.createRecipe}`, { headers });
  }
  saveRecipeName(formValue) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    formValue.nor_id = this.authService.getNorId();
    return this.http.post(`${this.base_uri + this.renameRecipe}`, formValue, {
      headers
    });
  }
  savePressureData(formValue) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    formValue.nor_id = this.authService.getNorId();
    return this.http.post(`${this.base_uri + this.updatePressure}`, formValue, {
      headers
    });
  }
  saveTemperatureData(formValue) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    formValue.nor_id = this.authService.getNorId();
    return this.http.post(
      `${this.base_uri + this.updateTemperature}`,
      formValue,
      { headers }
    );
  }
  recipeExportData(filename,type,norId?) {
    let norid=norId? norId :this.authService.getNorId();
    let data = this.authService.decodeToken();
    if (data != '') {
      this.userId = data.user_id;
    }
    this.loadToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${this.authToken}`);
    return this.http.get(`${this.base_uri}/exportrecipe?user_id=${this.userId}&type=${type}&file_name=${filename}&nor_id=${norid}`,{headers,responseType: 'blob'})
  }

  saveNewRecipe(formValue) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    formValue.nor_id = this.authService.getNorId();
    return this.http.post(
      `${this.base_uri + this.createNewRecipe}`,
      formValue,
      { headers }
    );
  }
  getDefaultData() {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.get(`${this.base_uri + this.defaultData}`, { headers });
  }
  importXmlFile(formValue) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    formValue.nor_id = this.authService.getNorId();
    return this.http.post(
      `${this.base_uri + this.importxml}`,
      formValue,
      { headers }
    );
  }
  setRecipeListInLocal(data) {
    this.recipeListObject = data;
  }
  getRecipeListInLocal() {
    return this.recipeListObject;
  }
  convertTemp(formValue) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.post(
      `${this.base_uri + this.convertTempApi}`,
      formValue,
      { headers }
    );
  }
  convertPressure(formValue) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.post(
      `${this.base_uri + this.convertPressureApi}`,
      formValue,
      { headers }
    );
  }

  converLineSpeed(formValue) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.post(
      `${this.base_uri + this.lineSpeedconvertApi}`,
      formValue,
      { headers }
    );
  }
  deleteRecipe(data){
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.post(
      `${this.base_uri + this.deleteRecipeApi}`,
      data,
      { headers }
    );
  }
}
