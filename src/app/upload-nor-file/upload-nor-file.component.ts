import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'nordson-upload-nor-file',
  templateUrl: './upload-nor-file.component.html',
  styleUrls: ['./upload-nor-file.component.css']
})
export class UploadNorFileComponent implements OnInit {
  private url = environment.BASE_URI;
  uploadForm: FormGroup;
  disable = true;
  TempUnits: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.uploadForm = this.fb.group({ norfile: [null] });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('norfile').setValue(file);
      const formData = new FormData();
      formData.append('norfile', this.uploadForm.get('norfile').value);
      this.authService.uploadNor(formData).subscribe(
        (data: any) => {
          if (data) {
            this.authService.setNorId(data.nor_id);
            this.router.navigate(['settings/temp-zone']);
          }
        },
        err => {
          console.log('err upload', err);
        }
      );
    }
  }
}
