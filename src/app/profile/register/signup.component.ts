import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EquipmentService } from 'src/app/equipment.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'nordson-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  equipment = 'PROBLUE FLEX';
  parentId: number;
  ccode: any;
  sno: any;
  uid: any
  description: string;
  disabled: boolean;
  serialNoUidVal: string = '';
  backButtonLink: string='/register'
  constructor(
    private router: Router,
    private equipmentService: EquipmentService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.parentId = this.route.snapshot.params.parentid;
    const tokenId = this.route.snapshot.params.token;

    if (this.parentId) {
      const userId = localStorage.getItem('subuserid');
      this.backButtonLink = (userId&&userId!=undefined)?`/sub-user-reg/${userId}/${this.parentId}/${tokenId}` :this.backButtonLink
      this.equipmentService.getEquipmentByParent().subscribe(
        (data: any) => {
          if (data.Status === 'Success') {
            this.ccode = data.data.equipment_pn;
            this.sno = data.data.equipment_sn;
            this.uid = data.data.uid;
            this.description = data.data.equipment_description;
            this.disabled = true;
            localStorage.setItem('equipmentSno', data.data.equipment_sn);
          }
        },
        (err: any) => {
          console.log('err', err);
        }
      );
    }
    let equipmentData = this.equipmentService.getEuipmentData();
    if (equipmentData != '' && equipmentData != undefined) {
      this.ccode = equipmentData.equipment_pn;
      this.sno = equipmentData.equipment_sn;
      this.uid = equipmentData.uid;
      this.description = equipmentData.equipment_description;
    }
  }

  onSubmit(formValue) {
    let formData;
    const userId = localStorage.getItem('id');
    const fullName = localStorage.getItem('name');
    formData = {
      equipment_model: formValue.equipment,
      equipment_sn: this.sno,
      equipment_pn: this.ccode,
      user_id: userId,
      username_of_registrant: fullName,
      equipment_description: this.description,
      uid: this.uid
    };
    this.equipmentService.setEquipmentData(formData);
    localStorage.setItem('equipmentData', JSON.stringify(formData))
    if (this.parentId) {
      let data = {
        parent_id: this.parentId
      };
      const tokenId=this.route.snapshot.params.token
      const subuserid=localStorage.getItem('subuserid')

      this.equipmentService.setRegistrationEmailData(data);
      console.log(subuserid,this.parentId,tokenId)
      this.router.navigate(['/signupemail',subuserid,this.parentId,tokenId]);
    } else {
      this.router.navigate(['/signupemail']);
    }
  }
  validateSerialNo() {
    let uid = this.uid?this.uid:'';
    let serialNo = this.sno?this.sno:'';
    //validate Serial NUmber
    this.serialNoUidVal = ''
    if (uid.length > 6 && serialNo.length > 9) {
      let data = {
        "uid": uid,
        "equipment_sn": serialNo
      }
      this.getConfigCode(uid, serialNo)

      // this.equipmentService.getSerialNumValidation(data).subscribe(
      //   (data: any) => {
      //     this.getConfigCode(uid, serialNo)
      //     if (data != null) {
      //       if (data.status == 'Success') {
      //         this.getConfigCode(uid, serialNo)
      //       } else {
      //         this.ccode = ''
      //         // this.serialNoUidVal = 'Equipment Serial number and Uid already registered'
      //         if(data.message){
      //           this.serialNoUidVal = 'Serial Number and UID must Match'
      //         }
              
      //       }
      //     }
      //   }
      // );
    }
  }
  getConfigCode(uid, sno) {
    let data = {
      "uid": uid,
      "sn": sno
    }
    this.equipmentService.getConfigurationCode(data).subscribe(
      (data: any) => {
        if (data.Status === 'Success') {
          this.ccode = data.data.configuration_code;
        }else{
          this.serialNoUidVal = 'Enter valid Serial Number and Unique Number to get Configuration Code'
          this.ccode = ''
        }
      },
      (err: any) => {
        console.log('err', err);
      }
    );
  }
  preventalpha(event) {
    return this.authService.preventalpha(event);
  }
}
