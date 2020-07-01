import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MaintenanceService } from '../maintenance.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth.service';
export interface DialogData {
  intervalMax: any;
  intervalMin: any;
  maintenanceTimerSet: any;
  maintenanceNotes: any;
  maintenanceActivity: any;
  maintenanceTitle: any;
  title:any;
}
@Component({
  selector: 'nordson-maintenance-status',
  templateUrl: './maintenance-status.component.html',
  styleUrls: ['./maintenance-status.component.css']
})
export class MaintenanceStatusComponent implements OnInit {
  tankTimer: any;
  pumpTimer: any;
  serviceAlertTimer: any;
  hydraulicFilterTimer: any;
  fillSystemTimer: any;
  hoseTimer1: any;
  hoseTimer2: any;
  hoseTimer3: any;
  hoseTimer4: any;
  hoseTimer5: any;
  hoseTimer6: any;
  hoseTimer7: any;
  hoseTimer8: any;
  inLineFilterTimer1: any;
  inLineFilterTimer2: any;
  inLineFilterTimer4: any;
  inLineFilterTimer3: any;
  inLineFilterTimer5: any;
  inLineFilterTimer6: any;
  inLineFilterTimer7: any;
  inLineFilterTimer8: any;
  moduleTimer1: any;
  moduleTimer2: any;
  moduleTimer3: any;
  moduleTimer4: any;
  moduleTimer5: any;
  moduleTimer6: any;
  moduleTimer7: any;
  moduleTimer8: any;
  nozzleTimer1: any;
  nozzleTimer2: any;
  nozzleTimer3: any;
  nozzleTimer4: any;
  nozzleTimer5: any;
  nozzleTimer6: any;
  nozzleTimer7: any;
  nozzleTimer8: any;
  solenoidTimer1: any;
  solenoidTimer2: any;
  solenoidTimer3: any;
  solenoidTimer4: any;
  solenoidTimer5: any;
  solenoidTimer6: any;
  solenoidTimer7: any;
  solenoidTimer8: any;
  generalTimer1: any;
  generalTimer2: any;
  generalTimer3: any;
  generalTimer4: any;
  generalTimer5: any;
  generalTimer6: any;
  generalTimer7: any;
  generalTimer8: any;
  maintenanceData: any;
  generalTimer9: any;
  generalTimer10: any;
  tankTimerName: any;
  pumpTimerName: any;
  tankTimerActivity: any;
  tankTimerNotes: any;
  tankTimerSet: any;
  pumpTimerActivity: any;
  pumpTimerNotes: any;
  pumpTimerSet: any;
  serviceAlertTimerName: any;
  serviceAlertTimerActivity: any;
  serviceAlertTimerNotes: any;
  serviceAlertTimerSet: any;
  hydraulicFilterTimerName: any;
  hydraulicFilterTimerActivity: any;
  hydraulicFilterTimerNotes: any;
  hydraulicFilterTimerSet: any;
  fillSystemTimerName: any;
  fillSystemTimerActivity: any;
  fillSystemTimerNotes: any;
  fillSystemTimerSet: any;
  hoseArray:any = [];
  moduleArray:any = [];
  nozzleArray:any = [];
  solenoidArray:any = [];
  inlineFilterArray:any = [];
  generalArray:any = [];
  loader: boolean = true;
  addedGeneralArray: any = [];//["General Purpose1", "General Purpose2", "General Purpose3", "General Purpose4", "General Purpose5", "General Purpose6", "General Purpose7", "General Purpose8", "General Purpose9", "General Purpose10"]
  notAddedGeneralArray: any = [];
  allGeneralArray:any = ["GeneralPurpose1","GeneralPurpose2","GeneralPurpose3","GeneralPurpose4","GeneralPurpose5","GeneralPurpose6","GeneralPurpose7","GeneralPurpose8","GeneralPurpose9","GeneralPurpose10"];
  fillSystemTitle: any;
  tankTitle: any;
  pumpTitle: any;
  serviceAlertTitle: any;
  hydraulicFilterTitle: any;
  tankIntervalMin: number;
  tankIntervalMax: number;
  pumpIntervalMin: number;
  pumpIntervalMax: number;
  serviceAlertIntervalMin: number;
  serviceAlertIntervalMax: number;
  hydraulicFilterIntervalMin: number;
  hydraulicFilterIntervalMax: number;
  fillSystemIntervalMin: number;
  fillSystemIntervalMax: number;

  constructor(
    public maintenanceService : MaintenanceService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.getMaintenanceList();
  }
  getMaintenanceList(){
    this.maintenanceService.getMaintenanceStatusList().subscribe(
      (data:any)=>{
        if(data.status){
          this.maintenanceData = data.data;
          this.loader = false;
          this.tankTimer = this.maintenanceData.TankTimer;
          this.getTankTimerData();
          
          this.pumpTimer = this.maintenanceData.PumpTimer;
          this.getPumpTimerData();
          this.pumpTimerName = this.pumpTimer.PumpTimerName1.Value;
          this.serviceAlertTimer = this.maintenanceData.ServiceAlertTimer;
          this.getServiceAlertTimer();
          this.hydraulicFilterTimer = this.maintenanceData.HydraulicFilterTimer;
          this.getHydraulicFilterTimer();
          this.fillSystemTimer = this.maintenanceData.FillSystemTimer;
          this.getFillSystemTimer();
          this.hoseTimer1 = this.maintenanceData.HoseTimer1;
          this.hoseTimer2 = this.maintenanceData.HoseTimer2;
          this.hoseTimer3 = this.maintenanceData.HoseTimer3;
          this.hoseTimer4 = this.maintenanceData.HoseTimer4;
          this.hoseTimer5 = this.maintenanceData.HoseTimer5;
          this.hoseTimer6 = this.maintenanceData.HoseTimer6;
          this.hoseTimer7 = this.maintenanceData.HoseTimer7;
          this.hoseTimer8 = this.maintenanceData.HoseTimer8;
          this.getHoseData(1,this.hoseTimer1);
          this.getHoseData(2,this.hoseTimer2);
          this.getHoseData(3,this.hoseTimer3);
          this.getHoseData(4,this.hoseTimer4);
          this.getHoseData(5,this.hoseTimer5);
          this.getHoseData(6,this.hoseTimer6);
          this.getHoseData(7,this.hoseTimer7);
          this.getHoseData(8,this.hoseTimer8);
          this.inLineFilterTimer1 = this.maintenanceData.InlineFilterTimer1;
          this.inLineFilterTimer2 = this.maintenanceData.InlineFilterTimer2;
          this.inLineFilterTimer3 = this.maintenanceData.InlineFilterTimer3;
          this.inLineFilterTimer4 = this.maintenanceData.InlineFilterTimer4;
          this.inLineFilterTimer5 = this.maintenanceData.InlineFilterTimer5;
          this.inLineFilterTimer6 = this.maintenanceData.InlineFilterTimer6;
          this.inLineFilterTimer7 = this.maintenanceData.InlineFilterTimer7;
          this.inLineFilterTimer8 = this.maintenanceData.InlineFilterTimer8;
          this.getInlineFilterData(1,this.inLineFilterTimer1);
          this.getInlineFilterData(2,this.inLineFilterTimer2);
          this.getInlineFilterData(3,this.inLineFilterTimer3);
          this.getInlineFilterData(4,this.inLineFilterTimer4);
          this.getInlineFilterData(5,this.inLineFilterTimer5);
          this.getInlineFilterData(6,this.inLineFilterTimer6);
          this.getInlineFilterData(7,this.inLineFilterTimer7);
          this.getInlineFilterData(8,this.inLineFilterTimer8);
          this.moduleTimer1 = this.maintenanceData.ModuleTimer1;
          this.moduleTimer2 = this.maintenanceData.ModuleTimer2;
          this.moduleTimer3 = this.maintenanceData.ModuleTimer3;
          this.moduleTimer4 = this.maintenanceData.ModuleTimer4;
          this.moduleTimer5 = this.maintenanceData.ModuleTimer5;
          this.moduleTimer6 = this.maintenanceData.ModuleTimer6;
          this.moduleTimer7 = this.maintenanceData.ModuleTimer7;
          this.moduleTimer8 = this.maintenanceData.ModuleTimer8;
          this.getModuleData(1,this.moduleTimer1);
          this.getModuleData(2,this.moduleTimer2);
          this.getModuleData(3,this.moduleTimer3);
          this.getModuleData(4,this.moduleTimer4);
          this.getModuleData(5,this.moduleTimer5);
          this.getModuleData(6,this.moduleTimer6);
          this.getModuleData(7,this.moduleTimer7);
          this.getModuleData(8,this.moduleTimer8);
          this.nozzleTimer1 = this.maintenanceData.NozzleTimer1;
          this.nozzleTimer2 = this.maintenanceData.NozzleTimer2;
          this.nozzleTimer3 = this.maintenanceData.NozzleTimer3;
          this.nozzleTimer4 = this.maintenanceData.NozzleTimer4;
          this.nozzleTimer5 = this.maintenanceData.NozzleTimer5;
          this.nozzleTimer6 = this.maintenanceData.NozzleTimer6;
          this.nozzleTimer7 = this.maintenanceData.NozzleTimer7;
          this.nozzleTimer8 = this.maintenanceData.NozzleTimer8;
          this.getNozzleData(1,this.nozzleTimer1);
          this.getNozzleData(2,this.nozzleTimer2);
          this.getNozzleData(3,this.nozzleTimer3);
          this.getNozzleData(4,this.nozzleTimer4);
          this.getNozzleData(5,this.nozzleTimer5);
          this.getNozzleData(6,this.nozzleTimer6);
          this.getNozzleData(7,this.nozzleTimer7);
          this.getNozzleData(8,this.nozzleTimer8);
          this.solenoidTimer1 = this.maintenanceData.SolenoidTimer1;
          this.solenoidTimer2 = this.maintenanceData.SolenoidTimer2;
          this.solenoidTimer3 = this.maintenanceData.SolenoidTimer3;
          this.solenoidTimer4 = this.maintenanceData.SolenoidTimer4;
          this.solenoidTimer5 = this.maintenanceData.SolenoidTimer5;
          this.solenoidTimer6 = this.maintenanceData.SolenoidTimer6;
          this.solenoidTimer7 = this.maintenanceData.SolenoidTimer7;
          this.solenoidTimer8 = this.maintenanceData.SolenoidTimer8;
          this.getSolenoidData(1,this.solenoidTimer1);
          this.getSolenoidData(2,this.solenoidTimer2);
          this.getSolenoidData(3,this.solenoidTimer3);
          this.getSolenoidData(4,this.solenoidTimer4);
          this.getSolenoidData(5,this.solenoidTimer5);
          this.getSolenoidData(6,this.solenoidTimer6);
          this.getSolenoidData(7,this.solenoidTimer7);
          this.getSolenoidData(8,this.solenoidTimer8);
          this.generalTimer1 = this.maintenanceData.GeneralTimer1;
          this.generalTimer2 = this.maintenanceData.GeneralTimer2;
          this.generalTimer3 = this.maintenanceData.GeneralTimer3;
          this.generalTimer4 = this.maintenanceData.GeneralTimer4;
          this.generalTimer5 = this.maintenanceData.GeneralTimer5;
          this.generalTimer6 = this.maintenanceData.GeneralTimer6;
          this.generalTimer7 = this.maintenanceData.GeneralTimer7;
          this.generalTimer8 = this.maintenanceData.GeneralTimer8;
          this.generalTimer9 = this.maintenanceData.GeneralTimer9;
          this.generalTimer10 = this.maintenanceData.GeneralTimer10;
          this.generalArray= [];
          this.addedGeneralArray = [];
          this.notAddedGeneralArray = [];
          this.getGeneralData(1,this.generalTimer1);
          this.getGeneralData(2,this.generalTimer2);
          this.getGeneralData(3,this.generalTimer3);
          this.getGeneralData(4,this.generalTimer4);
          this.getGeneralData(5,this.generalTimer5);
          this.getGeneralData(6,this.generalTimer6);
          this.getGeneralData(7,this.generalTimer7);
          this.getGeneralData(8,this.generalTimer8);
          this.getGeneralData(9,this.generalTimer9);
          this.getGeneralData(10,this.generalTimer10);
          this.notExistingGeneral();
        }
      },
      (err:any)=>{
        console.log("Maintenace Error",err)
      })
  }
  getTankTimerData(){
    this.tankTimerName = this.tankTimer.TankTimerName1.Value;
    this.tankTimerActivity = this.tankTimer.TankTimerActivity1.Value;
    this.tankTimerNotes = this.tankTimer.TankTimerNotes1.Value;
    this.tankTimerSet = this.tankTimer.TankTimer1.Value.split(",");
    this.tankTitle = this.tankTimer.maintenance_title;
    this.tankIntervalMin = 480;
    this.tankIntervalMax = 6000;
  }
  getPumpTimerData(){
    this.pumpTimerName = this.pumpTimer.PumpTimerName1.Value;
    this.pumpTimerActivity = this.pumpTimer.PumpTimerActivity1.Value;
    this.pumpTimerNotes = this.pumpTimer.PumpTimerNotes1.Value;
    this.pumpTimerSet = this.pumpTimer.PumpTimer1.Value.split(",");
    this.pumpTitle = this.pumpTimer.maintenance_title;
    this.pumpIntervalMin = 160;
    this.pumpIntervalMax = 6000;
  }
  getServiceAlertTimer(){
    this.serviceAlertTimerName = this.serviceAlertTimer.ServiceAlertTimerName1.Value;
    this.serviceAlertTimerActivity = this.serviceAlertTimer.ServiceAlertTimerActivity1.Value;
    this.serviceAlertTimerNotes = this.serviceAlertTimer.ServiceAlertTimerNotes1.Value;
    this.serviceAlertTimerSet = this.serviceAlertTimer.ServiceAlertTimer1.Value.split(",");
    this.serviceAlertTitle = this.serviceAlertTimer.maintenance_title;
    this.serviceAlertIntervalMin = 40;
    this.serviceAlertIntervalMax = 500;
  }
  getHydraulicFilterTimer(){
    this.hydraulicFilterTimerName = this.hydraulicFilterTimer.HydraulicFilterTimerName1.Value;
    this.hydraulicFilterTimerActivity = this.hydraulicFilterTimer.HydraulicFilterTimerActivity1.Value;
    this.hydraulicFilterTimerNotes = this.hydraulicFilterTimer.HydraulicFilterTimerNotes1.Value;
    this.hydraulicFilterTimerSet = this.hydraulicFilterTimer.HydraulicFilterTimer1.Value.split(",");
    this.hydraulicFilterTitle = this.hydraulicFilterTimer.maintenance_title;
    this.hydraulicFilterIntervalMin = 480;
    this.hydraulicFilterIntervalMax = 6000;
  }
  getFillSystemTimer(){
    this.fillSystemTimerName = this.fillSystemTimer.FillSystemTimerName1.Value;
    this.fillSystemTimerActivity = this.fillSystemTimer.FillSystemTimerActivity1.Value;
    this.fillSystemTimerNotes = this.fillSystemTimer.FillSystemTimerNotes1.Value;
    this.fillSystemTimerSet = this.fillSystemTimer.FillSystemTimer1.Value.split(",");
    this.fillSystemTitle = this.fillSystemTimer.maintenance_title;
    this.fillSystemIntervalMin = 40;
    this.fillSystemIntervalMax = 6000;
  }
  getHoseData(key,hoseData){
    if(hoseData["HoseTimerName"+key].Value != ""){
      this.hoseArray[key-1]= 
      {
        "Name":hoseData["HoseTimerName"+key].Value,
        "Activity":hoseData["HoseTimerActivity"+key].Value,
        "TimerSet":hoseData["HoseTimer"+key].Value.split(","),
        "Notes":hoseData["HoseTimerNotes"+key].Value,
        "title":hoseData.maintenance_title,
        "intervalMin": 2000,
        "intervalMax": 30000
      };
    }
  }
  getModuleData(key,moduleData){
    if(moduleData["ModuleTimerName"+key].Value != ""){
      this.moduleArray[key-1]= 
      {
        "Name":moduleData["ModuleTimerName"+key].Value,
        "Activity":moduleData["ModuleTimerActivity"+key].Value,
        "TimerSet":moduleData["ModuleTimer"+key].Value.split(","),
        "Notes":moduleData["ModuleTimerNotes"+key].Value,
        "title":moduleData.maintenance_title,
        "intervalMin": 480,
        "intervalMax": 30000
      };
    }
  }
  getSolenoidData(key,solenoidData){
    if(solenoidData["SolenoidTimerName"+key].Value != ""){
      this.solenoidArray[key-1]= 
      {
        "Name":solenoidData["SolenoidTimerName"+key].Value,
        "Activity":solenoidData["SolenoidTimerActivity"+key].Value,
        "TimerSet":solenoidData["SolenoidTimer"+key].Value.split(","),
        "Notes":solenoidData["SolenoidTimerNotes"+key].Value,
        "title":solenoidData.maintenance_title,
        "intervalMin": 480,
        "intervalMax": 30000
      };
    }
    
  }
  getInlineFilterData(key,inlineFilterData){
    if(inlineFilterData["InlineFilterTimerName"+key].Value != ""){
      this.inlineFilterArray[key-1]= 
      {
        "Name":inlineFilterData["InlineFilterTimerName"+key].Value,
        "Activity":inlineFilterData["InlineFilterTimerActivity"+key].Value,
        "TimerSet":inlineFilterData["InlineFilterTimer"+key].Value.split(","),
        "Notes":inlineFilterData["InlineFilterTimerNotes"+key].Value,
        "title":inlineFilterData.maintenance_title,
        "intervalMin": 160,
        "intervalMax": 6000
      };
    }
  }
  getNozzleData(key,nozzleData){
    if(nozzleData["NozzleTimerName"+key].Value != ""){
      this.nozzleArray[key-1]= 
      {
        "Name":nozzleData["NozzleTimerName"+key].Value,
        "Activity":nozzleData["NozzleTimerActivity"+key].Value,
        "TimerSet":nozzleData["NozzleTimer"+key].Value.split(","),
        "Notes":nozzleData["NozzleTimerNotes"+key].Value,
        "title":nozzleData.maintenance_title,
        "intervalMin": 480,
        "intervalMax": 30000
      };
    }
  }
  getGeneralData(key,generalData){
    if(generalData["GeneralTimerName"+key].Value != ""){
      // this.generalArray[key-1]= 
      // {
      //   "Name":generalData["GeneralTimerName"+key].Value,
      //   "Activity":generalData["GeneralTimerActivity"+key].Value,
      //   "TimerSet":generalData["GeneralTimer"+key].Value.split(","),
      //   "Notes":generalData["GeneralTimerNotes"+key].Value
      // };
      this.generalArray.push({
        "Name":generalData["GeneralTimerName"+key].Value,
        "Activity":generalData["GeneralTimerActivity"+key].Value,
        "TimerSet":generalData["GeneralTimer"+key].Value.split(","),
        "Notes":generalData["GeneralTimerNotes"+key].Value,
        "title":generalData.maintenance_title,
        "intervalMin": 160,
        "intervalMax": 30000
      })
      this.addedGeneralArray.push(generalData.maintenance_title);
    }
  }
  notExistingGeneral(){
    this.allGeneralArray.forEach(element => {
      if(!this.addedGeneralArray.includes(element)){
        this.notAddedGeneralArray.push(element);
      }
    });
  }
  addMaintenanceItem(): void{
    const dialogRef = this.dialog.open(AddMaintenanceItem,{
      width: '520px',
      height: 'auto',
      panelClass: 'addMaintenance',
      disableClose: true,
      data:{title:this.notAddedGeneralArray[0],maintenanceTitle:this.notAddedGeneralArray[0]}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.type=="submit"){
        this.ngOnInit();
      }
    });
  }
  editMaintenanceItem(title,titleName,timerSet,activity,notes,intervalMin,intervalMax): void{
    const dialogRef = this.dialog.open(EditMaintenanceItem,{
      width: '520px',
      height: 'auto',
      panelClass: 'addMaintenance',
      disableClose: true,
      data:{title:title,maintenanceTitle:titleName,maintenanceTimerSet:timerSet,maintenanceActivity:activity,maintenanceNotes:notes,intervalMin:intervalMin,intervalMax:intervalMax}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.type=="submit"){
        this.ngOnInit();
      }
      if(result != undefined){
        if(result.data == 'delete'){
          const dialogRef = this.dialog.open(DeleteMaintenanceItem,{
            width: '448px',
            height: '25%',
            panelClass: 'deleteMaintenance',
            disableClose: true,
            data:{title:title}
          });
          dialogRef.afterClosed().subscribe(result => {
            // type is submit than call onint
            if(result.type=="submit"){
              this.ngOnInit();
            }
          });
        }
      }else{
        this.ngOnInit();
      }
    });
  }
}

@Component({
  selector: 'add-maintentance-item',
  templateUrl: './add-maintenance-item.html',
  styleUrls: ['./maintenance-status.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddMaintenanceItem implements OnInit{
  addMaintenanceForm: FormGroup;
  maintenanceStatus: boolean;
  hours: any[];
  minutes: any;
  minutesArray: any;
  selectedHour: string;
  selectedMinute: string;
  todayDate: Date;
  dateFormats: any = ["MM/dd/yyyy","dd/MM/yyyy","yyyy/MM/dd"];
  dateFormat:string;
  yesterday: Date;
  constructor(
    public dialogRef: MatDialogRef<AddMaintenanceItem>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    public maintenanceService: MaintenanceService,
    public toaster: ToastrService,
    private authService: AuthService
  ){}
  ngOnInit(){
    this.todayDate = new Date();
    this.yesterday = new Date(this.todayDate)
    this.yesterday.setDate(this.yesterday.getDate() - 1)
    this.selectedHour = "00";
    this.selectedMinute = "01";
    this.setHours();
    this.setMinutes();
    this.addMaintenanceForm = this.fb.group({
      title:['',Validators.maxLength(160)],
      activity:['',Validators.maxLength(160)],
      interval:['',Validators.required],
      snooze:['',Validators.required],
      starton:['',Validators.required],
      notes:[''],
      startonHH:[this.selectedHour],
      startonMM:[this.selectedMinute],
      maintenanceRemainder:[this.maintenanceStatus]
    })

    this.getXmlData(()=>{
      this.addMaintenanceForm.patchValue({
        title:this.data.maintenanceTitle,
        activity:'Activity',
        starton:new Date(),
        startonHH:this.selectedHour,
        startonMM:this.selectedMinute,
        maintenanceRemainder:this.maintenanceStatus
      })
    })
    
  }
  closeAddMaintenance(): void {
    this.dialogRef.close({type:'cancel'});
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  toogleMaintenance(e) {
    this.maintenanceStatus = e.checked;
    if (e.checked === true) {
      this.addMaintenanceForm.get('maintenanceRemainder').patchValue(1);
    } else {
      this.addMaintenanceForm.get('maintenanceRemainder').patchValue(0);
    }
  }
  onSubmit(){
    let startontime = new Date(this.addMaintenanceForm.get("starton").value);
    let startonMonth = startontime.getMonth()+1;
    let starton = startontime.getDate()+"/"+startonMonth+"/"+startontime.getFullYear();
    const formdata = {
      nor_id: localStorage.getItem("nor_id"),
      maintenance_remindere:this.addMaintenanceForm.get("maintenanceRemainder").value == null ? 0 : this.addMaintenanceForm.get("maintenanceRemainder").value,
      maintenance_title:this.data.title,
      general_title:this.addMaintenanceForm.get("title").value,
      maintenance_sa:this.addMaintenanceForm.get("activity").value,
      maintenance_interval:this.addMaintenanceForm.get("interval").value * 60,
      maintenance_snooze:this.addMaintenanceForm.get("snooze").value * 60,
      maintenance_starton:starton+','+ this.addMaintenanceForm.get("startonHH").value+":"+this.addMaintenanceForm.get("startonMM").value,
      maintenance_interval_time_remaining:0,
      maintenance_snooze_time_remaining:0,
      maintenance_timer_status:0,
      maintenance_timer_added:0,
      maintenance_service_notes:this.addMaintenanceForm.get("notes").value,
      action:"add"
    }
    this.maintenanceService.updateMaintenanceItem(formdata).subscribe(
      (data:any)=>{
        this.dialogRef.close({type:'submit'});
        this.toaster.success(data.message, '', {
          timeOut: 3000
        });
      },
      (err:any)=>{
        this.toaster.success(err, '', {
          timeOut: 3000
        });
        this.dialogRef.close();
      })
  }
  get f() {
    return this.addMaintenanceForm.controls;
  }
  setHours() {
    let setHour: number;
    this.hours = [];
    setHour = 24;
    let i: any;
    for (i = 0; i < setHour; i++) {
      let val: any = i;
      if (val.toString().length == 1) {
        val = '0' + val;
      }
      this.hours.push({ value: val.toString() });
    }
  }
  setMinutes(){
    this.minutes = []
    let j: any;
    for (j = 0; j < 60; j++) {
      let val: any = j;
      if (val.toString().length == 1) {
        val = '0' + val;
      }
      this.minutes.push({ value: val.toString() });
    }
  }
  omit_special_char(event)
  {   
    var k;  
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
  getXmlData(cb){
    this.authService.getxmlData().subscribe(
      (data: any) => {
        if ((data.status = 'Success')) {
          this.dateFormat = this.dateFormats[Number(data.result.systemPreferences.eDateFmt.Value)];
          cb()
        }
      },
      (err: Error) => {
        console.log('err', err);
      }
    );
  }
}

@Component({
  selector: 'edit-maintentance-item',
  templateUrl: './edit-maintenance-item.html',
  styleUrls: ['./maintenance-status.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditMaintenanceItem implements OnInit{
  addMaintenanceForm: FormGroup;
  maintenanceStatus: boolean;
  hours: any[];
  minutes: any;
  minutesArray: any;
  selectedHour: string;
  selectedMinute: string;
  timerSet: any;
  type: any;
  allGeneralArray:any = ["GeneralPurpose1","GeneralPurpose2","GeneralPurpose3","GeneralPurpose4","GeneralPurpose5","GeneralPurpose6","GeneralPurpose7","GeneralPurpose8","GeneralPurpose9","GeneralPurpose10"];
  isDeleteEnable: any;
  todayDate: Date;
  intervalMin: any;
  intervalMax: any;
  dateFormats: any = ["MM/dd/yyyy","dd/MM/yyyy","yyyy/MM/dd"];
  dateFormat:string;
  yesterday: Date;
  // formdata: { nor_id: string; maintenance_remindere: any; maintenance_title: any; maintenance_sa: any; maintenance_interval: any; maintenance_snooze: any; maintenance_starton: string; maintenance_service_notes: any; action: any; };
  constructor(
    public dialogRef: MatDialogRef<EditMaintenanceItem>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    public maintenanceService: MaintenanceService,
    public toaster: ToastrService,
    private authService: AuthService
  ){}
  ngOnInit(){
    // this.maintenanceService.getMaintenanceDetails(this.data.maintenanceTitle).subscribe((data:any)=>{
      this.todayDate = new Date();
      this.yesterday = new Date(this.todayDate)
      this.yesterday.setDate(this.yesterday.getDate() - 1)
      //this.getXmlData();
      this.intervalMin = this.data.intervalMin;
      this.intervalMax = this.data.intervalMax;
      this.addMaintenanceForm = this.fb.group({
        title:['',Validators.maxLength(160)],
        activity:['',Validators.maxLength(160)],
        interval:['',[Validators.required,Validators.min(this.intervalMin), Validators.max(this.intervalMax)]],
        snooze:['',Validators.required],
        starton:['',Validators.required],
        notes:[''],
        startonHH:[''],
        startonMM:[''],
        maintenanceRemainder:[true]
      })
      this.timerSet = this.data.maintenanceTimerSet;
      let startDate = this.timerSet[3].split("/");
      // let startOnDate = new Date(Number(startDate[2]) , Number(startDate[1])-1, Number(startDate[0]));
      let startOnDate = new Date(startDate[1]+'/'+startDate[0]+'/'+startDate[2]);
      // let startOnDate = new Date();
      let currentDate = new Date();
      if(startDate[2] != "00" && startDate[0] !="00" && startDate[1] != "00"){
        if(startDate[2] == currentDate.getFullYear()){
          if(startDate[1] == currentDate.getMonth()+1){
            if(startDate[0] == currentDate.getDate()){
              startOnDate = new Date();
            }
          }
        }
      }else{
        startOnDate = new Date();
      }
      
      let selectedTime = this.timerSet[4].split(":")
      this.selectedHour = selectedTime[0];
      this.selectedMinute = selectedTime[1];
      this.setHours();
      this.setMinutes();
      this.isDeleteEnable = this.allGeneralArray.includes(this.data.title);
      const modalTitle=this.dialogRef.componentInstance.data.title;
      // startOnDate = this.dateFilter.transform(startOnDate,'MM/dd/yy')
      this.authService.getxmlData().subscribe(
        (data: any) => {
          if (data.status == 'Success') {
            this.dateFormat = this.dateFormats[Number(data.result.systemPreferences.eDateFmt.Value)];
            this.addMaintenanceForm.patchValue({
              title:this.data.maintenanceTitle,
              activity:this.data.maintenanceActivity,
              interval:this.timerSet[1]/60,
              snooze:this.timerSet[2]/60,
              starton:startOnDate,
              notes:this.data.maintenanceNotes,
              startonHH:this.selectedHour,
              startonMM:this.selectedMinute,
              maintenanceRemainder:this.timerSet[0]
            })
          }
        },
        (err: Error) => {
          console.log('err', err);
        }
      );
     
      // if not General disable textbox @Gaurav
      if(!modalTitle.includes('General')){
        this.addMaintenanceForm.get(`title`).disable();
      }
      
      this.intervalMin = this.data.intervalMin;
      this.intervalMax = this.data.intervalMax
    // },
    // (err:any)=>{

    // })
    
  }
  closeAddMaintenance(): void {
    this.dialogRef.close({type:'cancel'});
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  toogleMaintenance(e) {
    this.maintenanceStatus = e.checked;
    if (e.checked === true) {
      this.addMaintenanceForm.get('maintenanceRemainder').patchValue(1);
    } else {
      this.addMaintenanceForm.get('maintenanceRemainder').patchValue(0);
    }
  }
  onSubmit(){
    let startontime = new Date(this.addMaintenanceForm.get("starton").value);
    let startonMonth = startontime.getMonth()+1;
    let starton = startontime.getDate()+"/"+startonMonth+"/"+startontime.getFullYear();
    const formdata = {
      nor_id: localStorage.getItem("nor_id"),
      maintenance_remindere:this.addMaintenanceForm.get("maintenanceRemainder").value,
      maintenance_title:this.data.title,
      general_title:this.addMaintenanceForm.get("title").value,
      maintenance_sa:this.addMaintenanceForm.get("activity").value,
      maintenance_interval:this.addMaintenanceForm.get("interval").value * 60,
      maintenance_snooze:this.addMaintenanceForm.get("snooze").value * 60,
      maintenance_starton:starton+','+ this.addMaintenanceForm.get("startonHH").value+":"+this.addMaintenanceForm.get("startonMM").value,
      maintenance_interval_time_remaining:this.timerSet[5],
      maintenance_snooze_time_remaining:this.timerSet[6],
      maintenance_timer_status:this.timerSet[7],
      maintenance_timer_added:this.timerSet[8],
      maintenance_service_notes:this.addMaintenanceForm.get("notes").value,
      action:'update'
    }
    this.maintenanceService.updateMaintenanceItem(formdata).subscribe(
      (data:any)=>{
        this.dialogRef.close({type:'submit'});
        this.toaster.success(data.message, '', {
          timeOut: 3000
        });
      },
      (err:any)=>{
        this.dialogRef.close();
        this.toaster.success(err, '', {
          timeOut: 3000
        });
      })
  }
  get f() {
    return this.addMaintenanceForm.controls;
  }
  setHours() {
    let setHour: number;
    this.hours = [];
    setHour = 24;
    let i: any;
    for (i = 0; i < setHour; i++) {
      let val: any = i;
      if (val.toString().length == 1) {
        val = '0' + val;
      }
      this.hours.push({ value: val.toString() });
    }
  }
  setMinutes(){
    this.minutes = []
    let j: any;
    for (j = 0; j < 60; j++) {
      let val: any = j;
      if (val.toString().length == 1) {
        val = '0' + val;
      }
      this.minutes.push({ value: val.toString() });
    }
  }
  deleteMaintenanceItem(){
    this.dialogRef.close({data:'delete'});
  }
  omit_special_char(event)
  {   
    var k;  
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
  // getXmlData(){
  //   this.authService.getxmlData().subscribe(
  //     (data: any) => {
  //       if ((data.status = 'Success')) {
  //         this.dateFormat = this.dateFormats[Number(data.result.systemPreferences.eDateFmt.Value)];
  //       }
  //     },
  //     (err: Error) => {
  //       console.log('err', err);
  //     }
  //   );
  // }
}

@Component({
  selector:'delete-maintenance-item',
  templateUrl:'./delete-maintenance-item.html',
  styleUrls: ['./maintenance-status.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DeleteMaintenanceItem implements OnInit{
  formdata: { 
    nor_id: string;
    maintenance_remindere: string;
    maintenance_title: any;
    general_title: string;
    maintenance_sa: string; 
    maintenance_interval: string;
    maintenance_snooze: string;
    maintenance_starton: string;
    maintenance_interval_time_remaining: string,
    maintenance_snooze_time_remaining: string,
    maintenance_timer_status: string,
    maintenance_timer_added: string,
    maintenance_service_notes: string;
    action: any; 
  };
  maintenanceTitle: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteMaintenanceItem>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    public maintenanceService: MaintenanceService,
    public toaster: ToastrService
  ){}
  ngOnInit(){
    this.maintenanceTitle = this.data.title;
  }
  closeDeleteMaintenance(): void {
    this.dialogRef.close({type:'cancel'});
  }
  deleteMaintenanceItem(){
    this.formdata = {
      nor_id: localStorage.getItem("nor_id"),
      maintenance_remindere:'',
      maintenance_title:this.maintenanceTitle,
      general_title: '',
      maintenance_sa:'',
      maintenance_interval:'',
      maintenance_snooze:'',
      maintenance_starton:'',
      maintenance_interval_time_remaining:"",
      maintenance_snooze_time_remaining:"",
      maintenance_timer_status:"",
      maintenance_timer_added:"",
      maintenance_service_notes:'',
      action:'delete'
    }
    this.maintenanceService.updateMaintenanceItem(this.formdata).subscribe(
      (data:any)=>{
        this.dialogRef.close({type:'submit'});
        this.toaster.success(data.message, '', {
          timeOut: 3000
        });
      },
      (err:any)=>{
        this.dialogRef.close();
        this.toaster.success(err, '', {
          timeOut: 3000
        });
      })
  }
}