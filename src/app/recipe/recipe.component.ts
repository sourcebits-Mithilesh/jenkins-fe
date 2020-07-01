import { Component, OnInit, Inject } from '@angular/core';
import { RecipeService } from './recipe.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../tools/configuration-code/configuration-code.component';
import { Router, NavigationExtras } from '@angular/router';
import { FlashserviceService } from 'src/app/shared/flashservice.service';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { accessType } from '../settings/access-type-check';
import { saveAs } from 'file-saver';

export interface DialogData { }

@Component({
  selector: 'nordson-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  recipeList: any;
  checkedList = [];
  recipeForm: FormGroup;
  // uploadForm: FormGroup;
  importXmlForm: FormGroup;
  selectSortType: string;
  newRecipeName: string;
  accessType: any;
  errMessage:any;
  SortData = [
    { value: 'date', viewValue: 'Date' },
    { value: 'name', viewValue: 'Name' },
  ];
  isChecked: boolean=false;
  selectedAll: any;
  constructor(
    private recipeService: RecipeService,
    private fb: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private flash: FlashserviceService,
    private userService: UserService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.enableEvent('none', '0.7');
    this.selectSortType = this.SortData[1].value;
    this.importXmlForm = this.fb.group({
      recipefile: [''],
    });
    this.getRecipeList();

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
      if (this.accessType === 1) {
        this.recipeForm.disable();
      }
    }
  }
  getRecipeList() {
    this.isChecked=false;
    this.recipeList = [];
    this.recipeService.getRecipeList().subscribe(
      (data: any) => { 
        this.errMessage=data.status
        if ((data.status == 'success')) {
          const receipeArr = data.recipeFile;
          for (var index in receipeArr) {
            let name = receipeArr[index].fileName.split('.');
            let date = receipeArr[index].fileDateTime
            this.recipeList.push({
              name: name[0].trim(),
              date: date,
              number: parseInt(index) + 1,
              selected: false
            });
            this.checkedList = [];
            for (let i = 0; i < this.recipeList.length; i++) {
              this.recipeForm = this.fb.group({
                [this.recipeList.name]: ['']
              });
            }
            
          }
          this.enableEvent('auto', '1');
        }
        else if(data.status=='fail'){
          this.enableEvent('none','0.7')
        }
      },
      (err: Error) => {
        console.log('err', err);
        this.enableEvent('none', '0.7');
      }
    );
  
    this.recipeService.setRecipeListInLocal(this.recipeList);
  }
  enableEvent(event, opacity) {
    document.getElementById('Open').style.pointerEvents = event;
    document.getElementById('Open').style.opacity = opacity;

    document.getElementById('export').style.pointerEvents = event;
    document.getElementById('export').style.opacity = opacity;

    document.getElementById('saveas').style.pointerEvents = event;
    document.getElementById('saveas').style.opacity = opacity;

    document.getElementById('delete').style.pointerEvents = event;
    document.getElementById('delete').style.opacity = opacity;
  }
  openSaveAsModal(): void {
    let id = this.getRecipeName();
    // tslint:disable-next-line: no-use-before-declare
    if (id != false) {
      const dialogRef = this.dialog.open(SaveAsModal, {
        width: '520px',
        height: '225px',
        panelClass: 'matsaveasmodal',
        id,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getRecipeList();
      });
    }
  }
  createNewRecipeModal(): void {
    this.selectedAll=false;
    const dialogRef = this.dialog.open(CreateNewModal, {
      width: '520px',
      height: '225px',
      panelClass: 'matcreaterecipemodal',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getRecipeList();
      this.newRecipeName = result;
    });
  }
  checkAll(event){
    if(event.checked){
      for (let i = 0; i < this.recipeList.length; i++) {
        this.recipeList[i].selected = this.selectedAll;
        if(this.checkedList.indexOf(this.recipeList[i].name)===-1){
          this.checkedList.push(this.recipeList[i].name);
        }
      }
    }
    else{
      for (let i = 0; i < this.recipeList.length; i++) {
        this.recipeList[i].selected = this.selectedAll;
        let index = this.checkedList.indexOf(this.recipeList[i].name);
        if (index > -1) {
          this.checkedList.splice(index, 1);
        }
      }
    }
  }
  checkRecipe(event, value) {
    this.selectedAll = this.recipeList.every(function(item:any) {
      return item.selected == true;
    })
    if (event.checked) {
      if(this.checkedList.indexOf(value)===-1){
        this.checkedList.push(value);
      }
    }
    if (!event.checked) {
      let index = this.checkedList.indexOf(value);
      if (index > -1) {
        this.checkedList.splice(index, 1);
      }
    }
    if (value == 'all') {
      for (let i = 0; i <= this.recipeList.length; i++) {
        this.recipeForm.controls[name].setValue(true);
      }
    }
  }
  openRecipe() {
    let name = this.getRecipeName();
    this.recipeService.setOpenRecipe(name);
    if (name != false) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          page: 'update'
        }
      };
      this.router.navigate(['/recipe/settings'], navigationExtras);
    }
  }
  getRecipeName() {
    if (this.checkedList.length == 1) {
      return this.checkedList[0];
    } else if (this.checkedList.length == 0) {
      this.toast.error('Please select a Recipe', '', {
        timeOut: 3000
      });
      return false;
    } else {
      this.toast.error('Please select only one Recipe', '', {
        timeOut: 3000
      });
      return false;
    }
  }
  createRecipe() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        page: 'create'
      }
    };
    this.router.navigate(['/recipe/settings'], navigationExtras);
  }

  //import recipe
  //   Hi team recipe xml import api is done
  // API=> 13.82.40.173:3200/api/import-recipe
  // Method => POST
  // Request data => recipefile:"filenam.xml"
  onFileChange2(event) {
    // if recipie is already 50
    if(this.recipeList.length===50){
      this.toast.error('Can not create more then 50 recipe file', '', {
        timeOut: 3000
      });
      return;
    }
    if(event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      //event.target.files[0].name
      let newRecipeName = event.target.files[0].name
      newRecipeName = newRecipeName.replace('.xml','');
      const recipeList: any = this.recipeService.getRecipeListInLocal();
      let findRecipe: any;
      let validateName: boolean = false
    if (recipeList != undefined) {
      findRecipe = recipeList.find(data => data.name.toLocaleLowerCase() == newRecipeName.toLocaleLowerCase());
      if (findRecipe != undefined) {
        //exists
        validateName = false;
      } else {
        //not exists
        validateName = true;
      }
    }
    if(validateName == false){
      this.toast.error('Recipe Name already Exists', '', {
        timeOut: 3000
      });
    }else if (fileExt === 'xml') {
        this.importXmlForm.get('recipefile').setValue(file);
        const formData = new FormData();
        formData.append('nor_id', this.authService.getNorId());
        formData.append(
          'recipefile',
          this.importXmlForm.get('recipefile').value
        );
        this.recipeService.importXmlFile(formData).subscribe(
          (data: any) => {
            if (data.status == "success") {
              this.selectedAll=false;
              this.getRecipeList();
              this.toast.success('Recipe imported successfully', '', {
                timeOut: 3000
              });
            } else if (data.status == "Fail") {
              this.getRecipeList();
              this.toast.error(data.message, '', {
                timeOut: 3000
              });
            } else {
              this.getRecipeList();
              this.toast.error("Something Went Wrong", '', {
                timeOut: 3000
              });
            }
          },
          err => {
            console.log('err upload', err);
          }
        );
      } else {
        this.toast.error('please select file with .xml extension', '', {
          timeOut: 3000
        });
      }
    }
  }
  exportRecipe() {
    let name = this.getRecipeName();
    if (name != false) {
      this.recipeService.recipeExportData(name + '.xml','Recipes')
      .subscribe((data:any)=>{
        console.log(data)
        const blob = new Blob([data], { type: 'application/xml' });
        saveAs(blob, `${name}.xml`);
      },(err:any)=>{
        console.log('err',err);
      })
    }
  }
  sortRecipeData(event) {
    this.checkedList = [];
    this.selectSortType = event.value;
    if(this.selectSortType=="date"){
     this.recipeList=this.sortByDate(this.recipeList);
    }else{
     this.recipeList=this.sortByName(this.recipeList);
    }
   
  }
  
  sortByName(arr){
   return arr= arr.sort((a, b)=> {
      return a.name.localeCompare(b.name);
   });
  }
  sortByDate(arr){
   return arr=arr.sort((a,b)=>{
      return <any>new Date(a.date)- <any> new Date(b.date)
    })
  } 
  deleteRecipe(){
    this.isChecked=false;
    if(this.checkedList.length>0){
      let deleteRecipeData = {"fileName":this.checkedList,"nor_id":this.authService.getNorId()}
      this.recipeService.deleteRecipe(deleteRecipeData).subscribe(
        (data:any)=>{
          if(data.status){
            this.getRecipeList();
            this.toast.success(data.message, '', {
              timeOut: 3000
            });
          }
          this.enableEvent('none', '0.7');

        },
        (err: Error)=>{
          console.log("delete recipe error", err)
        }
      )
    }
    else{
      this.toast.error('Please select a Recipe', '', {
        timeOut: 3000
      });
    }
  }

}

@Component({
  selector: 'nordson-recipe',
  templateUrl: './recipe-saveAsModal.html',
  styleUrls: ['./recipe.component.css']
})
export class SaveAsModal implements OnInit {
  profile: any;
  recipeName: string;
  currentName: string;
  accessType: number;
  saveStatus: boolean = false;
  recipeErr: string;
  validateName: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<SaveAsModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private recipeService: RecipeService,
    private userService: UserService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.currentName = this.dialogRef.id;
    this.recipeName = this.dialogRef.id;

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }
  renameRecipeName() {
    //Recipe Name validation
    const newRecipeName = this.recipeName;
    const recipeList: any = this.recipeService.getRecipeListInLocal();
    let findRecipe: any;
    this.recipeErr = '';
    if (recipeList != undefined) {
      findRecipe = recipeList.find(data => data.name.toLowerCase() == newRecipeName.toLowerCase());
      if (findRecipe != undefined) {
        this.validateName = false;
      } else {
        this.validateName = true;
      }
    }
    //
    if (newRecipeName && this.validateName) {
      let requestData = {
        fileName: this.currentName + '.xml',
        newFileName: this.recipeName + '.xml'
      };

      this.recipeService.saveRecipeName(requestData).subscribe(
        (data: any) => {
          if (data.status == 'success') {
            this.toast.success('Recipe name is saved successfully', '', {
              timeOut: 3000
            });
            this.dialogRef.close();
            // this.getRecipeList();
          }
          else{
            this.toast.error(data.message, '', {
              timeOut: 3000
            });
          }
        },
        (err: Error) => {
          console.log('err', err);
        }
      );
    } else {
      this.recipeErr = 'Recipe Name should be Unique';
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  preventSpecialChar(event) {
    var regex = new RegExp('^[a-zA-Z0-9]+$');
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
    this.saveStatus = true
  }
  allowBackSpace(event) {
    if (event.key === "Backspace") {
        this.saveStatus = true
    }
  }
}

/*  Create New Recipe popup */
@Component({
  selector: 'nordson-recipe',
  templateUrl: './recipe-CreateNewModal.html',
  styleUrls: ['./recipe.component.css']
})
export class CreateNewModal implements OnInit {
  recipeNewForm: FormGroup;
  recipeNewName: string;
  validateName: boolean = true;
  recipeErr: string = '';
  accessType;
  constructor(
    public dialogRef: MatDialogRef<CreateNewModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private router: Router,
    private recipeService: RecipeService,
    private userService: UserService,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
    this.recipeNewForm = this.fb.group({
      newRecipeName: [
        '',
        Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9]+$')]),
      ]
    });

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }
  get f() {
    return this.recipeNewForm.controls;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnChanges() {
    alert(this.recipeNewForm.get('newRecipeName').value);
  }
  onSubmit() {
    //Recipe Name validation
    if(!this.recipeNewForm.valid){
      this.toaster.error('Invalid Value for Recipe Name', '', {
        timeOut: 3000
      });
      return;
    }
    this.recipeNewForm.markAsPristine()
    const newRecipeName = this.recipeNewForm.get('newRecipeName').value;
    let requestData = {
      recipeFileName: newRecipeName,
    };
    const recipeList: any = this.recipeService.getRecipeListInLocal();
    let findRecipe: any;
    this.recipeErr = '';
    if (recipeList != undefined) {
      findRecipe = recipeList.find(data => data.name.toLowerCase() == newRecipeName.toLowerCase());
      if (findRecipe != undefined) {
        this.validateName = false;
      } else {
        this.validateName = true;
      }
    }

    if (this.recipeNewForm.get('newRecipeName').value && this.validateName == true
    ) {
      this.recipeService.saveNewRecipe(requestData)
      .subscribe((data:any)=>{
        if(data.status=='success'){
          this.dialogRef.close();
          this.toaster.success('Recipe created successfully', '', {
            timeOut: 3000
          });
        }
        else{
          this.toaster.error(data.message, '', {
            timeOut: 3000
          });
        }
      },(err:any)=>{
        console.log('err',err)
      })
      localStorage.setItem('newRecipeName', newRecipeName);
      let navigationExtras: NavigationExtras = {
        queryParams: {
          page: 'create'
        }
      };
      //this.router.navigate(['/recipe/settings'], navigationExtras);
    } else {
      this.recipeErr = 'Recipe Name should be Unique';
    }
  }
  preventSpecialChar(event) {
    var regex = new RegExp('^[a-zA-Z0-9]+$');
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }
}
