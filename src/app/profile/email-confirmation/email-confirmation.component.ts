import { Component, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { UserService } from 'src/app/user.service';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'nordson-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {
  emailConfirmation: FormGroup;
  confirmedEmail:boolean= false;
  isConfirmedEmail:boolean= true
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private toaster: ToastrService,
  ) {}

  ngOnInit() {
    // const token = this.route.snapshot.params.vertkn;
    // this.userService.emailConfirmation(token).subscribe(
    //   (data: any) => {},
    //   err => {
    //     console.log('err', err);
    //   }
    // );
  }
  confirmEmail() {
    
    const token = this.route.snapshot.params.vertkn;
    this.userService.emailConfirmation(token).subscribe(
      (data: any) => {
        if(data.Status === "Fail"){
          this.toaster.error(
            data.message,
            '',
            { timeOut: 3000 }
          );
        }else{
          this.confirmedEmail=true;
           this.isConfirmedEmail= false;
        }
      },
      err => {
        console.log(err);
      }
    );
    // localStorage.clear(); 
  }
}
