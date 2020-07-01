import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../maintenance.service';

@Component({
  selector: 'nordson-maintenance-history',
  templateUrl: './maintenance-history.component.html',
  styleUrls: ['./maintenance-history.component.css']
})
export class MaintenanceHistoryComponent implements OnInit {
  maintenanceHistorys: any = [];
  noRecordsMsg: string;
  dataExists: boolean = false;
  historyLists: any;

  constructor(private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    this.maintenanceService.getMaintenanceHistory().subscribe(
      (data:any)=>{
        console.log("maintenance history",data)
        if(data.status){
          this.dataExists = true;
          this.historyLists = data.data;
          this.historyLists.forEach(element => {
            if(element[0] != "SNOOZE"){
              this.maintenanceHistorys.push(element)
            }
          });
        }else{
          this.dataExists = false;
          this.noRecordsMsg = "No Records Found";
        }
      },
      (err:any)=>{
        console.log("Maintenance History Error",err)
      })
  }

}
