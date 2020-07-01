import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgFlashMessageService } from 'ng-flash-messages';
import { range } from '../system-input/output-range';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { accessType } from '../access-type-check';

@Component({
  selector: 'nordson-system-output',
  templateUrl: './system-output.component.html',
  styleUrls: ['./system-output.component.css']
})
export class SystemOutputComponent implements OnInit {
  outputArr = ['L1', 'L2', 'L3'];
  lightTowerArr=['LT 1','LT 2','LT 3','LT 4','LT 5','LT 6','LT 7']
  outputForm: FormGroup;
  ranges = range;
  accessType: any;
  defaultOutputOptions1: any;
  defaultOutputOptions2: any;
  defaultOutputOptions3: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private flash: NgFlashMessageService,
    private userService: UserService,
    private toast: ToastrService
  ) {}

  ngOnInit() {

    let group = {};
    for (let i = 0; i <=10; i++) {
      group[`OutputOptions${i}`] = [''];
      group[`InvertOutput${i}`] = [''];
    }
    this.outputForm = this.fb.group(group);

    this.authService.getxmlData().subscribe((data: any) => {
      if (data.status === 'Success') {
        this.authService.setNorId(data.result.nor_id);
        
        const OutputOptionsVal = data.result.systemIoControll.OutputOptions;
        const InvertOutputVal = data.result.systemIoControll.InvertOutput;
        let OutputOptions=[];
        let toSelect=[];
        let InvertOutput=[];
        let patchedJson={};

        for(let i=0;i<=18;i++){
          const OutputOptionsArr=`OutputOptions${i}`;
          const InvertArr =`InvertOutput${i}`;
          OutputOptions[i]= OutputOptionsVal[OutputOptionsArr]?OutputOptionsVal[OutputOptionsArr].Value:0
          toSelect[i]=this.ranges.find(c => c.id == OutputOptions[i])
          InvertOutput[i]= InvertOutputVal[InvertArr]?parseInt(InvertOutputVal[InvertArr].Value):0
        }

        for(let i=0;i<=10;i++){
          if(i>=4 && i<=10){
            patchedJson[`OutputOptions${i}`]=toSelect[i+8]
            patchedJson[`InvertOutput${i}`]=InvertOutput[i+8]
          }else{
            patchedJson[`OutputOptions${i}`]=toSelect[i]
            patchedJson[`InvertOutput${i}`]=InvertOutput[i]
          } 
        }
        console.log(patchedJson)
        this.outputForm.patchValue(patchedJson)
      }
    });

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }

  checked(e, i) {
    if (e.checked === true) {
      this.outputForm.get(`InvertOutput${i}`).patchValue(1);
    } else if (e.checked === false) {
      this.outputForm.get(`InvertOutput${i}`).patchValue(0);
    }
  }

  checked1(e) {
    if (e.checked === true) {
      this.outputForm.get('InvertOutput0').patchValue(1);
    } else if (e.checked === false) {
      this.outputForm.get('InvertOutput0').patchValue(0);
    }
  }


  onSubmit() {
    this.outputForm.markAsPristine();
    const formData = this.outputForm.getRawValue();
    let formVal={};
    let OutputValArr=[]
    for(let i=0;i<=18;i++){
      if(i>=4 && i<=11){}
      else if(i>=12 && i<=18){
        formVal[`InvertOutput${i}`]=formData[`InvertOutput${i-8}`]
        formVal[`OutputOptions${i}`]=formData[`OutputOptions${i-8}`].id
        // push into array if value is non-zero
        if(formData[`OutputOptions${i-8}`].id) OutputValArr.push(formData[`OutputOptions${i-8}`].id)
      }
      else{
        formVal[`InvertOutput${i}`]=formData[`InvertOutput${i}`]
        formVal[`OutputOptions${i}`]=formData[`OutputOptions${i}`].id
        // push into array if value is non-zero
        if(formData[`OutputOptions${i}`].id) OutputValArr.push(formData[`OutputOptions${i}`].id)
      }
    }

    // show validation message if same value is in dropdown
    // if(new Set(OutputValArr).size !== OutputValArr.length){
    //   this.toast.error('Select unique values for Output option fields', '', {
    //     timeOut: 3000
    //   });
    //   return;
    // }
  
    this.authService.updateOutput(formVal).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.toast.success('System Output updated successfully', '', {
            timeOut: 3000
          });
        }
      },
      (err: any) => {
        this.toast.error(err.error.message, '', {
          timeOut: 3000
        });
      }
    );
  }
}

