import { Component, OnInit,ViewChild, OnChanges, Inject } from '@angular/core';
import { SpinnerService } from '../../spinner/spinner.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import{ Chart } from 'chart.js';
import { AuthService } from 'src/app/auth.service';
import  moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData { }

export interface REPORTS {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'nordson-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit,OnChanges {
  twix:any;
  LineChart=[];
  BarChart=[];
  PieChart=[];
  reportsTime:any=[];
  totAdhesivePerHour:any=[];
  totalAdhesiveChart:any=[];
  choice = '';
  reportsForm: FormGroup;
  @ViewChild('MONTH_VIEW') MONTH_VIEW;
  @ViewChild('WEEK_VIEW') WEEK_VIEW;
  @ViewChild('DAY_VIEW') DAY_VIEW;
  @ViewChild('tabGroup') tabGroup;
  canvas: any;
  ctx: any;
  canvas2:any;
  ctx2:any;
  reports = ['Total Adhesive Used(g)','Adhesive Add On','Production','System Status']
  items:any = [
    { id: 'Slide_1' },
    { id: 'Slide_2' },
    { id: 'Slide_3' },
  ]
  items2:any;
  items3:any;
  reportData:any;
  startDate:any;
  endDate:any;
  range:any=[]
  text:any;
  selectedIndex=0;
  getDays:any;
  getWeeks:any;
  getMonths:any;
  reportsArr:any;
  weekArr: any;
  monthArr: any;

  addOnPerProduct: any;
  totalProducts: any;
  defectiveProducts: any;
  reportDates: any=["01/01/2020"];
  reportDayData: any=[];
  previousDate: string;
  nextDate: any;
  reportsDate: any;
  reportWeekData: any=[];
  reportMonthData: any=[];
  totalWeekProducts: any;
  defectiveWeekProducts: any;
  reportsWeekTime: any;
  reportsWeekDate: any;
  nextWeekDate: Date;
  weekDates: any=["01/01/2020"];
  currentDate: any;
  nextMonthDate: any;
  monthDates: any=["01/01/2020"];
  totalMonthProducts: any[];
  defectiveMonthProducts: any[];
  reportsMonthTime: any[];
  reportsMonthDate: any[];
  productionChart: any = [];
  currentGraph: any;
  graphType=true;
  index: any = 0;
  globalLabel: any = 'DAY_VIEW';
  generalAddon: any;
  generalAverage: any;
  generalTotal: any;
  generalLimit: any;
  displayTargets: boolean = false;
  generalWeekAddon: any;
  generalWeekAverage: any;
  generalWeekTotal: any;
  generalWeekLimit: any;
  generalMonthAddon: any;
  generalMonthAverage: any;
  generalMonthTotal: any;
  generalMonthLimit: any;
  // loading:boolean=true;
  

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private authService:AuthService,
    public spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    
    this.reportsForm = this.fb.group({
      reportTypes:['']
    })

    this.reportsForm.get('reportTypes').patchValue(this.reports[0],{onlySelf: true})
    this.choice = this.reports[0];
    
    this.getReportData('day',this.reports.indexOf(this.choice)+1,'DAY_VIEW1');
    this.getReportData('week',this.reports.indexOf(this.choice)+1,'WEEK_VIEW');
    this.getReportData('month',this.reports.indexOf(this.choice)+1,'MONTH_VIEW');

    
  }
  
  ngAfterViewInit(){
    //this.items2 =this.getWeeks;
  }

  ngOnChanges(){
    console.log('onchange',this.reports.indexOf(this.choice)+2 == 5,this.choice)
  }
  OpenProductionYieldModal(): void {
    const dialogRef = this.dialog.open(ProductionYieldModal, {
      panelClass: 'matProductionYieldModal',
      disableClose: true,
      backdropClass: 'popupBackdropClassLog',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  setValue(event) {
    if (event.isUserInput) {
      this.choice = event.source.value;
      this.index = 0;
      switch (this.choice) {
        case 'Total Adhesive Used(g)':
          this.graphType=true
          setTimeout(() => {
            this.totalAdhesiveGraph('DAY_VIEW1',this.reportDates[0]);
            this.getCurrentGraphTitle('DAY_VIEW',0);
          }, 3000)
          break;
        case 'Production':
          this.graphType=true
            setTimeout(() => {
              this.productionGraph('DAY_VIEW1',this.reportDates[0]);
              this.getCurrentGraphTitle('DAY_VIEW',0);
            }, 3000)
            
            break;
        case 'Adhesive Add On':
          this.graphType=true
            setTimeout(() => {
              this.totalAdhesiveAddOnGraph('DAY_VIEW1',this.reportDates[0]);
              this.getCurrentGraphTitle('DAY_VIEW',0);
            }, 3000)
            
            break;
        case 'System Status':
          this.graphType=true
          setTimeout(() => {
            this.systemStatusGraph('DAY_VIEW1',this.reportDates[0]);
            this.getCurrentGraphTitle('DAY_VIEW',0);
          }, 3000)
          break;

          case 'Production Yield':
            this.graphType=false
            setTimeout(() => {
              this.productionYieldGraph('DAY_VIEW1',this.reportDates[0]);
              this.getCurrentGraphTitle('DAY_VIEW',0);
            }, 3000)
            break;

        default:
      }
    }
  }
  getProductionYieldData(){
    this.choice = 'Production Yield';
    this.selectionChange();
    this.graphType=false
    setTimeout(() => {
      this.productionYieldGraph('DAY_VIEW1',this.reportDates[0]);
      this.getCurrentGraphTitle('DAY_VIEW',0);
    }, 3000)
  }
  getCurrentGraphTitle(type,index){
    if(this.choice=='Production Yield'){
      this.currentGraph=1;
    }
    else{
    if(type == 'DAY_VIEW'){
      this.currentGraph = moment(this.reportDates[index]).format('MM/DD/YYYY') +' - '+moment(this.reportDates[index]).add(1,'days').format('MM/DD/YYYY');
    }else if(type == 'WEEK_VIEW'){
      this.currentGraph = moment(this.weekDates[index]).format('MM/DD/YYYY') +' - '+moment(this.weekDates[index]).add(1,'weeks').format('MM/DD/YYYY');
    }else if(type == 'MONTH_VIEW'){
      this.currentGraph = moment(this.monthDates[index]).format('MM/DD/YYYY') +' - '+moment(this.monthDates[index]).add(1,'months').format('MM/DD/YYYY');
    }
  }

  }
  selectionChange(){
    // this.next(0)
    this.reportDayData = [];
    this.reportWeekData = [];
    this.reportMonthData = [];
    let reportFor;
    this.globalLabel = 'DAY_VIEW';
    if(this.choice == 'System Status'){
      this.displayTargets = false;
      this.getSystemStatusData()
    }
    else if(this.choice == 'Production Yield'){
      reportFor = 4;
    }
    else{
     reportFor = this.reports.indexOf(this.choice)+1;
    }
    if(this.choice != 'System Status'){
      setTimeout(() => {
        this.getReportData('day',reportFor,'DAY_VIEW1');
      }, 1000)
      setTimeout(() => {
        this.getReportData('week',reportFor,'WEEK_VIEW');
      }, 1000)
      setTimeout(() => {
        this.getReportData('month',reportFor,'MONTH_VIEW');
      }, 1000)
    }
    
    // this.productionGraph('DAY_VIEW1',this.reportDates[0]);
  }

  onTabChanged(e){
    // const dayType=e.tab.textLabel.split(' ')[0].toLowerCase();
    // this.selectedIndex=e.index
    // const labelText = e.tab.textLabel.replace(' ', '_')
    // this.text=labelText
    // this.items2 =this.getWeeks;
    // this.next(0)
    const labelText = e.tab.textLabel.replace(' ', '_');
    this.globalLabel = labelText;
    this.index = 0;
    this.getCurrentGraphTitle(labelText,0);
    if(this.choice == 'Total Adhesive Used(g)'){
      if(labelText == 'DAY_VIEW'){
        this.totalAdhesiveGraph('DAY_VIEW1',this.reportDates[0]);
      }else if(labelText == 'WEEK_VIEW'){
        this.totalAdhesiveGraph('WEEK_VIEW',this.weekDates[0]);
      }else if(labelText == 'MONTH_VIEW'){
        this.totalAdhesiveGraph('MONTH_VIEW',this.monthDates[0]);
      }
    }
    else if(this.choice == 'Adhesive Add On'){
      if(labelText == 'DAY_VIEW'){
        this.totalAdhesiveAddOnGraph('DAY_VIEW1',this.reportDates[0]);
      }else if(labelText == 'WEEK_VIEW'){
        this.totalAdhesiveAddOnGraph('WEEK_VIEW',this.weekDates[0]);
      }else if(labelText == 'MONTH_VIEW'){
        this.totalAdhesiveAddOnGraph('MONTH_VIEW',this.monthDates[0]);
      }
    }
    else if(this.choice == 'Production'){
      if(labelText == 'DAY_VIEW'){
        this.productionGraph('DAY_VIEW1',this.reportDates[0]);
      }else if(labelText == 'WEEK_VIEW'){
        this.productionGraph('WEEK_VIEW',this.weekDates[0]);
      }else if(labelText == 'MONTH_VIEW'){
        this.productionGraph('MONTH_VIEW',this.monthDates[0]);
      }
    }
    else if(this.choice == 'Production Yield'){
      console.log(labelText,this.monthDates[0])
      if(labelText == 'DAY_VIEW'){
        this.productionYieldGraph('DAY_VIEW1',this.reportDates[0]);
      }else if(labelText == 'WEEK_VIEW'){
        this.productionYieldGraph('WEEK_VIEW',this.weekDates[0]);
      }else if(labelText == 'MONTH_VIEW'){
        this.productionYieldGraph('MONTH_VIEW',this.monthDates[0]);
      }
    }
    else if(this.choice == 'System Status'){
      if(labelText == 'DAY_VIEW'){
        this.systemStatusGraph('DAY_VIEW1',this.reportDates[0]);
      }else if(labelText == 'WEEK_VIEW'){
        this.systemStatusGraph('WEEK_VIEW',this.weekDates[0]);
      }else if(labelText == 'MONTH_VIEW'){
        this.systemStatusGraph('MONTH_VIEW',this.monthDates[0]);
      }
    }
    
  }
  
  nextEvent(e){
    this.index++;
    this.getCurrentGraphTitle(this.globalLabel,this.index);
    
  }
  prevEvent(e){
    this.index--;
    this.getCurrentGraphTitle(this.globalLabel,this.index);
  }

  getSystemStatusData(){
    this.authService.getSystemStatus()
    .subscribe((res:any)=>{
      if(res.status){
        console.log('system status',res.response)
        this.getSystemStatus(res,'day');
        this.getSystemStatus(res,'week');
        this.getSystemStatus(res,'month');
      }
    },(err:any)=>{
      console.log('err',err)
    })
  }
  
  getReportData(reportType,reportFor,currentTab){
    // const type=this.reports.indexOf(this.choice)+2 == 5
    // if(type){
    //   reportFor = 5
    // }
    this.authService.getReports(reportType,reportFor)
    .subscribe((res:any)=>{
      //day data
      // res = {"status":true,"responseArr":[{"totalProducts":1274660,"defectiveProducts":144,"date":"04/16/2020","time":"06:21:35"},{"totalProducts":1274784,"defectiveProducts":144,"date":"04/16/2020","time":"06:22:35"},{"totalProducts":1274909,"defectiveProducts":144,"date":"04/16/2020","time":"06:23:35"},{"totalProducts":1275034,"defectiveProducts":144,"date":"04/16/2020","time":"06:24:35"},{"totalProducts":1275159,"defectiveProducts":144,"date":"04/16/2020","time":"06:25:35"},{"totalProducts":1275284,"defectiveProducts":144,"date":"04/16/2020","time":"06:26:35"},{"totalProducts":1275409,"defectiveProducts":144,"date":"04/16/2020","time":"06:27:35"},{"totalProducts":1275534,"defectiveProducts":144,"date":"04/16/2020","time":"06:28:35"},{"totalProducts":1275659,"defectiveProducts":144,"date":"04/16/2020","time":"06:29:35"},{"totalProducts":1275784,"defectiveProducts":144,"date":"04/16/2020","time":"06:30:35"},{"totalProducts":1275909,"defectiveProducts":144,"date":"04/16/2020","time":"06:31:35"},{"totalProducts":1276034,"defectiveProducts":144,"date":"04/16/2020","time":"06:32:35"},{"totalProducts":1276159,"defectiveProducts":144,"date":"04/16/2020","time":"06:33:35"},{"totalProducts":1276284,"defectiveProducts":144,"date":"04/16/2020","time":"06:34:35"},{"totalProducts":1276409,"defectiveProducts":144,"date":"04/16/2020","time":"06:35:35"},{"totalProducts":1276534,"defectiveProducts":144,"date":"04/16/2020","time":"06:36:35"},{"totalProducts":1276659,"defectiveProducts":144,"date":"04/16/2020","time":"06:37:35"},{"totalProducts":1276784,"defectiveProducts":144,"date":"04/16/2020","time":"06:38:35"},{"totalProducts":1276909,"defectiveProducts":144,"date":"04/16/2020","time":"06:39:35"},{"totalProducts":1277034,"defectiveProducts":144,"date":"04/16/2020","time":"06:40:35"},{"totalProducts":1277159,"defectiveProducts":144,"date":"04/16/2020","time":"06:41:35"},{"totalProducts":1277284,"defectiveProducts":144,"date":"04/16/2020","time":"06:42:35"},{"totalProducts":1277409,"defectiveProducts":144,"date":"04/16/2020","time":"06:43:35"},{"totalProducts":1277534,"defectiveProducts":144,"date":"04/16/2020","time":"06:44:35"},{"totalProducts":1277659,"defectiveProducts":144,"date":"04/16/2020","time":"06:45:35"},{"totalProducts":1277784,"defectiveProducts":144,"date":"04/16/2020","time":"06:46:35"},{"totalProducts":1277909,"defectiveProducts":144,"date":"04/16/2020","time":"06:47:35"},{"totalProducts":1278038,"defectiveProducts":144,"date":"04/16/2020","time":"06:48:37"},{"totalProducts":1278159,"defectiveProducts":144,"date":"04/16/2020","time":"06:49:35"},{"totalProducts":1278284,"defectiveProducts":144,"date":"04/16/2020","time":"06:50:35"},{"totalProducts":1278409,"defectiveProducts":144,"date":"04/16/2020","time":"06:51:35"},{"totalProducts":1278534,"defectiveProducts":144,"date":"04/16/2020","time":"06:52:35"},{"totalProducts":1278659,"defectiveProducts":144,"date":"04/16/2020","time":"06:53:35"},{"totalProducts":1278784,"defectiveProducts":144,"date":"04/16/2020","time":"06:54:35"},{"totalProducts":1278909,"defectiveProducts":144,"date":"04/16/2020","time":"06:55:35"},{"totalProducts":1279034,"defectiveProducts":144,"date":"04/16/2020","time":"06:56:35"},{"totalProducts":1279159,"defectiveProducts":144,"date":"04/16/2020","time":"06:57:35"},{"totalProducts":1279284,"defectiveProducts":144,"date":"04/16/2020","time":"06:58:35"},{"totalProducts":1279409,"defectiveProducts":144,"date":"04/16/2020","time":"06:59:35"},{"totalProducts":1279534,"defectiveProducts":144,"date":"04/16/2020","time":"07:00:35"},{"totalProducts":1279659,"defectiveProducts":144,"date":"04/16/2020","time":"07:01:35"},{"totalProducts":1279784,"defectiveProducts":144,"date":"04/16/2020","time":"07:02:35"},{"totalProducts":1279909,"defectiveProducts":144,"date":"04/16/2020","time":"07:03:35"},{"totalProducts":1280034,"defectiveProducts":144,"date":"04/16/2020","time":"07:04:35"},{"totalProducts":1280159,"defectiveProducts":144,"date":"04/16/2020","time":"07:05:35"},{"totalProducts":1280284,"defectiveProducts":144,"date":"04/16/2020","time":"07:06:35"},{"totalProducts":1280409,"defectiveProducts":144,"date":"04/16/2020","time":"07:07:35"},{"totalProducts":1280534,"defectiveProducts":144,"date":"04/16/2020","time":"07:08:35"},{"totalProducts":1280659,"defectiveProducts":144,"date":"04/16/2020","time":"07:09:35"},{"totalProducts":1280784,"defectiveProducts":144,"date":"04/16/2020","time":"07:10:35"},{"totalProducts":1280909,"defectiveProducts":144,"date":"04/16/2020","time":"07:11:35"},{"totalProducts":1281034,"defectiveProducts":144,"date":"04/16/2020","time":"07:12:35"},{"totalProducts":1281159,"defectiveProducts":144,"date":"04/16/2020","time":"07:13:35"},{"totalProducts":1281284,"defectiveProducts":144,"date":"04/16/2020","time":"07:14:35"},{"totalProducts":1281409,"defectiveProducts":144,"date":"04/16/2020","time":"07:15:35"},{"totalProducts":1281534,"defectiveProducts":144,"date":"04/16/2020","time":"07:16:35"},{"totalProducts":1281659,"defectiveProducts":144,"date":"04/16/2020","time":"07:17:35"},{"totalProducts":1281784,"defectiveProducts":144,"date":"04/16/2020","time":"07:18:35"},{"totalProducts":1281909,"defectiveProducts":144,"date":"04/16/2020","time":"07:19:35"},{"totalProducts":1282034,"defectiveProducts":144,"date":"04/16/2020","time":"07:20:35"},{"totalProducts":1282159,"defectiveProducts":144,"date":"04/17/2020","time":"07:21:35"},{"totalProducts":1282284,"defectiveProducts":144,"date":"04/17/2020","time":"07:22:35"},{"totalProducts":1282409,"defectiveProducts":144,"date":"04/17/2020","time":"07:23:35"},{"totalProducts":1282534,"defectiveProducts":144,"date":"04/17/2020","time":"07:24:35"},{"totalProducts":1282659,"defectiveProducts":144,"date":"04/17/2020","time":"07:25:35"},{"totalProducts":1283097,"defectiveProducts":144,"date":"04/17/2020","time":"07:30:26"},{"totalProducts":1283219,"defectiveProducts":144,"date":"04/17/2020","time":"07:31:25"},{"totalProducts":1283344,"defectiveProducts":144,"date":"04/17/2020","time":"07:32:25"}]}
      //week data
      // res = {"status":true,"responseArr":[{"totalProducts":1274660,"defectiveProducts":144,"date":"04/16/2020","time":"6:21:35"},{"totalProducts":1282159,"defectiveProducts":145,"date":"04/16/2020","time":"7:21:35"},{"totalProducts":1289658,"defectiveProducts":146,"date":"04/17/2020","time":"8:21:35"},{"totalProducts":1297157,"defectiveProducts":147,"date":"04/17/2020","time":"9:21:35"},{"totalProducts":1304656,"defectiveProducts":148,"date":"04/18/2020","time":"10:21:35"},{"totalProducts":1312155,"defectiveProducts":149,"date":"04/18/2020","time":"11:21:35"},{"totalProducts":1319654,"defectiveProducts":150,"date":"04/19/2020","time":"6:21:35"},{"totalProducts":1327153,"defectiveProducts":151,"date":"04/19/2020","time":"7:21:35"},{"totalProducts":1334652,"defectiveProducts":152,"date":"04/20/2020","time":"8:21:35"},{"totalProducts":1342151,"defectiveProducts":153,"date":"04/20/2020","time":"9:21:35"},{"totalProducts":1349650,"defectiveProducts":154,"date":"04/21/2020","time":"10:21:35"},{"totalProducts":1357149,"defectiveProducts":155,"date":"04/21/2020","time":"11:21:35"},{"totalProducts":1364648,"defectiveProducts":156,"date":"04/22/2020","time":"6:21:35"},{"totalProducts":1372147,"defectiveProducts":157,"date":"04/22/2020","time":"7:21:35"},{"totalProducts":1379646,"defectiveProducts":158,"date":"04/23/2020","time":"8:21:35"},{"totalProducts":1387145,"defectiveProducts":159,"date":"04/23/2020","time":"9:21:35"},
      // {"totalProducts":1349650,"defectiveProducts":154,"date":"04/24/2020","time":"10:21:35"},{"totalProducts":1357149,"defectiveProducts":155,"date":"04/25/2020","time":"11:21:35"},{"totalProducts":1364648,"defectiveProducts":156,"date":"04/26/2020","time":"6:21:35"},{"totalProducts":1372147,"defectiveProducts":157,"date":"04/27/2020","time":"7:21:35"},{"totalProducts":1379646,"defectiveProducts":158,"date":"04/28/2020","time":"8:21:35"},{"totalProducts":1387145,"defectiveProducts":159,"date":"04/29/2020","time":"9:21:35"},
      // {"totalProducts":1372147,"defectiveProducts":157,"date":"04/30/2020","time":"7:21:35"},{"totalProducts":1379646,"defectiveProducts":158,"date":"04/31/2020","time":"8:21:35"},{"totalProducts":1387145,"defectiveProducts":159,"date":"05/01/2020","time":"9:21:35"},
      // {"totalProducts":1372147,"defectiveProducts":157,"date":"05/02/2020","time":"7:21:35"},{"totalProducts":1379646,"defectiveProducts":158,"date":"05/03/2020","time":"8:21:35"},{"totalProducts":1387145,"defectiveProducts":159,"date":"05/04/2020","time":"9:21:35"}]}
      // res = {"status":true,"responseArr":[{"addOnPerProduct":0,"date":"04/16/2020","time":"6:21:35"},{"addOnPerProduct":831,"date":"04/16/2020","time":"7:21:35"},{"addOnPerProduct":832,"date":"04/17/2020","time":"8:21:35"},{"addOnPerProduct":833,"date":"04/17/2020","time":"9:21:35"},{"addOnPerProduct":834,"date":"04/18/2020","time":"10:21:35"},{"addOnPerProduct":835,"date":"04/18/2020","time":"11:21:35"},{"addOnPerProduct":836,"date":"04/19/2020","time":"6:21:35"},{"addOnPerProduct":837,"date":"04/19/2020","time":"7:21:35"},{"addOnPerProduct":838,"date":"04/20/2020","time":"8:21:35"},{"addOnPerProduct":839,"date":"04/20/2020","time":"9:21:35"},{"addOnPerProduct":840,"date":"04/21/2020","time":"10:21:35"},{"addOnPerProduct":841,"date":"04/21/2020","time":"11:21:35"},{"addOnPerProduct":842,"date":"04/22/2020","time":"6:21:35"},{"addOnPerProduct":843,"date":"04/22/2020","time":"7:21:35"},{"addOnPerProduct":844,"date":"04/23/2020","time":"8:21:35"},{"addOnPerProduct":845,"date":"04/23/2020","time":"9:21:35"},{"ATSTargetAddon":"1000","avgPerProduct":845,"totalNumOfProduct":1387145,"productOutOfLimit":159,"ATSAlertLowerLimit":"200","ATSAlertUpperLimit":"300","ATSFaultLowerLimit":"300","ATSFaultUpperLimit":"400"}]}
      //res = {"status":true,"response":[{"eventStatus":"07","dateTime":"031120184450","month":"03","day":"11","year":"20","hour":"18","min":"44","sec":"45"},{"eventStatus":"07","dateTime":"031120184455","month":"03","day":"11","year":"20","hour":"18","min":"44","sec":"55"},{"eventStatus":"07","dateTime":"031120184500","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"00"},{"eventStatus":"07","dateTime":"031120184505","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"05"},{"eventStatus":"07","dateTime":"031120184510","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"10"},{"eventStatus":"07","dateTime":"031120184515","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"15"},{"eventStatus":"07","dateTime":"031120184520","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"20"},{"eventStatus":"07","dateTime":"031120184525","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"25"},{"eventStatus":"07","dateTime":"031120184530","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"30"},{"eventStatus":"07","dateTime":"031120184535","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"35"},{"eventStatus":"07","dateTime":"031120184540","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"40"},{"eventStatus":"07","dateTime":"031120184545","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"45"},{"eventStatus":"07","dateTime":"031120184550","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"50"},{"eventStatus":"07","dateTime":"031120184555","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"55"},{"eventStatus":"07","dateTime":"031120184600","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"00"},{"eventStatus":"07","dateTime":"031120184605","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"05"},{"eventStatus":"07","dateTime":"031120184610","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"10"},{"eventStatus":"07","dateTime":"031120184615","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"15"},{"eventStatus":"07","dateTime":"031120184620","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"20"},{"eventStatus":"07","dateTime":"031120184625","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"25"},{"eventStatus":"07","dateTime":"031120184630","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"30"},{"eventStatus":"07","dateTime":"031120184635","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"35"},{"eventStatus":"07","dateTime":"031120184640","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"40"},{"eventStatus":"07","dateTime":"031120184645","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"45"},{"eventStatus":"07","dateTime":"031120184650","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"50"},{"eventStatus":"07","dateTime":"031120184655","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"55"},{"eventStatus":"07","dateTime":"031120184700","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"00"},{"eventStatus":"07","dateTime":"031120184705","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"05"},{"eventStatus":"07","dateTime":"031120184710","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"10"},{"eventStatus":"07","dateTime":"031120184715","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"15"},{"eventStatus":"07","dateTime":"031120184720","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"20"},{"eventStatus":"07","dateTime":"031120184725","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"25"},{"eventStatus":"07","dateTime":"031120184730","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"30"},{"eventStatus":"07","dateTime":"031120184735","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"35"},{"eventStatus":"07","dateTime":"031120184740","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"40"},{"eventStatus":"07","dateTime":"031120184745","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"45"},{"eventStatus":"07","dateTime":"031120184750","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"50"},{"eventStatus":"07","dateTime":"031120184755","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"55"},{"eventStatus":"07","dateTime":"031120184800","month":"03","day":"11","year":"20","hour":"18","min":"48","sec":"00"},{"eventStatus":"07","dateTime":"031120184805","month":"03","day":"11","year":"20","hour":"18","min":"48","sec":"05"},{"eventStatus":"07","dateTime":"031120184810","month":"03","day":"11","year":"20","hour":"18","min":"48","sec":"10"},{"eventStatus":"07","dateTime":"031120184815","month":"03","day":"11","year":"20","hour":"18","min":"48","sec":"15"},{"eventStatus":"07","dateTime":"031120184820","month":"03","day":"11","year":"20","hour":"18","min":"48","sec":"20"}]}
      //res = {"status":true,"response":[{"eventStatus":"13","dateTime":"042020181820","month":"04","day":"20","year":"20","hour":"18","min":"18","sec":"20"},{"eventStatus":"00","dateTime":"042020181820","month":"04","day":"20","year":"20","hour":"18","min":"18","sec":"20"},{"eventStatus":"00","dateTime":"042020181820","month":"04","day":"20","year":"20","hour":"18","min":"18","sec":"20"},{"eventStatus":"00","dateTime":"042020181820","month":"04","day":"20","year":"20","hour":"18","min":"18","sec":"20"},{"eventStatus":"00","dateTime":"042020181820","month":"04","day":"20","year":"20","hour":"18","min":"18","sec":"20"},{"eventStatus":"00","dateTime":"042020181820","month":"04","day":"20","year":"20","hour":"18","min":"18","sec":"20"},{"eventStatus":"00","dateTime":"042020181820","month":"04","day":"20","year":"20","hour":"18","min":"18","sec":"20"},{"eventStatus":"00","dateTime":"041920191820","month":"04","day":"19","year":"20","hour":"19","min":"18","sec":"20"},{"eventStatus":"00","dateTime":"041920191820","month":"04","day":"19","year":"20","hour":"19","min":"18","sec":"20"},{"eventStatus":"00","dateTime":"041920191820","month":"04","day":"19","year":"20","hour":"19","min":"18","sec":"20"},{"eventStatus":"00","dateTime":"041920191820","month":"04","day":"19","year":"20","hour":"19","min":"18","sec":"20"},{"eventStatus":"01","dateTime":"041920201820","month":"04","day":"19","year":"20","hour":"20","min":"18","sec":"20"},{"eventStatus":"01","dateTime":"041820201820","month":"04","day":"18","year":"20","hour":"20","min":"18","sec":"20"},{"eventStatus":"01","dateTime":"041820201820","month":"04","day":"18","year":"20","hour":"20","min":"18","sec":"20"},{"eventStatus":"01","dateTime":"041820201820","month":"04","day":"18","year":"20","hour":"20","min":"18","sec":"20"},{"eventStatus":"01","dateTime":"041820211820","month":"04","day":"18","year":"20","hour":"21","min":"18","sec":"20"},{"eventStatus":"01","dateTime":"041720211820","month":"04","day":"17","year":"20","hour":"21","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041720211820","month":"04","day":"17","year":"20","hour":"21","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041720211820","month":"04","day":"17","year":"20","hour":"21","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041620211820","month":"04","day":"16","year":"20","hour":"21","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041620221820","month":"04","day":"16","year":"20","hour":"22","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041520221820","month":"04","day":"15","year":"20","hour":"22","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041520221820","month":"04","day":"15","year":"20","hour":"22","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041520231820","month":"04","day":"15","year":"20","hour":"23","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041420231820","month":"04","day":"14","year":"20","hour":"23","min":"18","sec":"20"},{"eventStatus":"03","dateTime":"041220241820","month":"04","day":"12","year":"20","hour":"24","min":"18","sec":"20"},{"eventStatus":"03","dateTime":"041320241820","month":"04","day":"13","year":"20","hour":"24","min":"18","sec":"20"},{"eventStatus":"03","dateTime":"041320241820","month":"04","day":"13","year":"20","hour":"24","min":"18","sec":"20"},{"eventStatus":"03","dateTime":"041320241820","month":"04","day":"13","year":"20","hour":"24","min":"18","sec":"20"},{"eventStatus":"03","dateTime":"042120251820","month":"04","day":"21","year":"20","hour":"25","min":"18","sec":"20"},{"eventStatus":"03","dateTime":"042120251820","month":"04","day":"21","year":"20","hour":"25","min":"18","sec":"20"},{"eventStatus":"04","dateTime":"041220251820","month":"04","day":"12","year":"20","hour":"25","min":"18","sec":"20"},{"eventStatus":"04","dateTime":"041220261820","month":"04","day":"12","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"04","dateTime":"041120261820","month":"04","day":"11","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"04","dateTime":"041120261820","month":"04","day":"11","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"04","dateTime":"041020261820","month":"04","day":"10","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"04","dateTime":"040920261820","month":"04","day":"09","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"04","dateTime":"040820261820","month":"04","day":"08","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041620221820","month":"04","day":"16","year":"20","hour":"22","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041520221820","month":"04","day":"15","year":"20","hour":"22","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041520221820","month":"04","day":"15","year":"20","hour":"22","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041520231820","month":"04","day":"15","year":"20","hour":"23","min":"18","sec":"20"},{"eventStatus":"02","dateTime":"041420231820","month":"04","day":"14","year":"20","hour":"23","min":"18","sec":"20"},{"eventStatus":"03","dateTime":"041320241820","month":"04","day":"13","year":"20","hour":"24","min":"18","sec":"20"},{"eventStatus":"04","dateTime":"041320241820","month":"04","day":"13","year":"20","hour":"24","min":"18","sec":"20"},{"eventStatus":"05","dateTime":"041320241820","month":"04","day":"13","year":"20","hour":"24","min":"18","sec":"20"},{"eventStatus":"06","dateTime":"042120251820","month":"04","day":"21","year":"20","hour":"25","min":"18","sec":"20"},{"eventStatus":"07","dateTime":"042120251820","month":"04","day":"21","year":"20","hour":"25","min":"18","sec":"20"},{"eventStatus":"08","dateTime":"041220251820","month":"04","day":"12","year":"20","hour":"25","min":"18","sec":"20"},{"eventStatus":"09","dateTime":"041220261820","month":"04","day":"12","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"10","dateTime":"041120261820","month":"04","day":"11","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"11","dateTime":"041120261820","month":"04","day":"11","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"12","dateTime":"041020261820","month":"04","day":"10","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"13","dateTime":"040920261820","month":"04","day":"09","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"04","dateTime":"040820261820","month":"04","day":"08","year":"20","hour":"26","min":"18","sec":"20"},{"eventStatus":"07","dateTime":"031120184455","month":"03","day":"11","year":"20","hour":"18","min":"44","sec":"55"},{"eventStatus":"07","dateTime":"031120184500","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"00"},{"eventStatus":"07","dateTime":"031120184505","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"05"},{"eventStatus":"07","dateTime":"031120184510","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"10"},{"eventStatus":"07","dateTime":"031120184515","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"15"},{"eventStatus":"07","dateTime":"031120184520","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"20"},{"eventStatus":"07","dateTime":"031120184525","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"25"},{"eventStatus":"07","dateTime":"031120184530","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"30"},{"eventStatus":"07","dateTime":"031120184535","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"35"},{"eventStatus":"07","dateTime":"031120184540","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"40"},{"eventStatus":"07","dateTime":"031120184545","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"45"},{"eventStatus":"07","dateTime":"031120184550","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"50"},{"eventStatus":"07","dateTime":"031120184555","month":"03","day":"11","year":"20","hour":"18","min":"45","sec":"55"},{"eventStatus":"07","dateTime":"031120184600","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"00"},{"eventStatus":"07","dateTime":"031120184605","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"05"},{"eventStatus":"07","dateTime":"031120184610","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"10"},{"eventStatus":"07","dateTime":"031120184615","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"15"},{"eventStatus":"07","dateTime":"031120184620","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"20"},{"eventStatus":"07","dateTime":"031120184625","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"25"},{"eventStatus":"07","dateTime":"031120184630","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"30"},{"eventStatus":"07","dateTime":"031120184635","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"35"},{"eventStatus":"07","dateTime":"031120184640","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"40"},{"eventStatus":"07","dateTime":"031120184645","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"45"},{"eventStatus":"07","dateTime":"031120184650","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"50"},{"eventStatus":"07","dateTime":"031120184655","month":"03","day":"11","year":"20","hour":"18","min":"46","sec":"55"},{"eventStatus":"07","dateTime":"031120184700","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"00"},{"eventStatus":"07","dateTime":"031120184705","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"05"},{"eventStatus":"07","dateTime":"031120184710","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"10"},{"eventStatus":"07","dateTime":"031120184715","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"15"},{"eventStatus":"07","dateTime":"031120184720","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"20"},{"eventStatus":"07","dateTime":"031120184725","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"25"},{"eventStatus":"07","dateTime":"031120184730","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"30"},{"eventStatus":"07","dateTime":"031120184735","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"35"},{"eventStatus":"07","dateTime":"031120184740","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"40"},{"eventStatus":"07","dateTime":"031120184745","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"45"},{"eventStatus":"07","dateTime":"031120184750","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"50"},{"eventStatus":"07","dateTime":"031120184755","month":"03","day":"11","year":"20","hour":"18","min":"47","sec":"55"},{"eventStatus":"07","dateTime":"031120184800","month":"03","day":"11","year":"20","hour":"18","min":"48","sec":"00"},{"eventStatus":"07","dateTime":"031120184805","month":"03","day":"11","year":"20","hour":"18","min":"48","sec":"05"},{"eventStatus":"07","dateTime":"031120184810","month":"03","day":"11","year":"20","hour":"18","min":"48","sec":"10"},{"eventStatus":"07","dateTime":"031120184815","month":"03","day":"11","year":"20","hour":"18","min":"48","sec":"15"},{"eventStatus":"07","dateTime":"031120184820","month":"03","day":"11","year":"20","hour":"18","min":"48","sec":"20"}]}
      if(res.status){
        if(this.choice == 'Total Adhesive Used(g)'){
          this.displayTargets = false;
          this.getTotalAdhesive(res,reportType);
          // this.getTotalAdhesive(res);
          // this.totalAdhesiveGraph(currentTab);
        }else if(this.choice == 'Adhesive Add On'){
          this.displayTargets = true;
          this.getTotalAdhesiveAddOn(res,reportType);
        }else if(this.choice == 'Production'){
          this.displayTargets = false;
          this.getProduction(res,reportType);
        }
        if(this.choice == 'Production Yield'){
          this.displayTargets = false;
          this.getProductionYield(res,reportType);
        }
        // else if(this.reports.indexOf(this.choice)+1 == 4){
          // this.getProductionYield(res);
          // this.productionYieldGraph(currentTab);
        else if(this.choice == 'System Status'){
          //this.displayTargets = false;
          //this.getSystemStatus(res,reportType);
          //this.systemStatusGraph(currentTab);
        }
      }
    },(err:any)=>{
      console.log('err',err)
    })
  }


  getColorCode(eventStatus){
    if(eventStatus=="13"){
      return '#00940A';
    }else if(eventStatus=="14"){
      return '#0066CC';
    }
    else if(eventStatus=="04" || eventStatus=="05" || eventStatus=="06"){
      return '#F1C713';
    }
    else if(eventStatus=="12" || eventStatus=="07" || eventStatus=="08" || eventStatus=="09"){
      return '#FE0000';
    }
    else{
      return '#808080';
    }
  }
  getBetweenWeeks(startDate,endDate){
    this.weekDates.push(moment(startDate).format('MM/DD/YYYY'));
    while(startDate < endDate){
      let nextWeekDate = moment(startDate).add(1,'weeks').format('MM/DD/YYYY');
      if(new Date(nextWeekDate) < endDate){
        this.weekDates.push(nextWeekDate);
      }
      startDate = new Date(nextWeekDate);
    }
  }
  getBetweenMonths(startDate,endDate){
    this.monthDates.push(moment(startDate).format('MM/DD/YYYY'));
    while(startDate < endDate){
      let nextMonthDate = moment(startDate).add(1,'months').format('MM/DD/YYYY');
      if(new Date(nextMonthDate) < endDate){
        this.monthDates.push(nextMonthDate);
      }
      startDate = new Date(nextMonthDate);
    }
  }
  getNextWeekDate1(currentDate){
    if(this.weekDates[this.weekDates.indexOf(currentDate) + 1]){
      this.nextWeekDate = new Date(this.weekDates[this.weekDates.indexOf(currentDate) + 1]);
    }else{
      this.nextWeekDate = new Date(moment(new Date(currentDate)).add(1,'weeks').format('MM/DD/YYYY'))
    }
    
  }
  getNextMonthDate1(currentDate){
    if(this.monthDates[this.monthDates.indexOf(currentDate)+1]){
      this.nextMonthDate = new Date(this.monthDates[this.monthDates.indexOf(currentDate)+1]);
    }else{
      this.nextMonthDate = new Date(moment(new Date(currentDate)).add(1,'months').format('MM/DD/YYYY'))
    }
  }
  addDefaultData(currentDate){
    while(new Date(currentDate) > this.nextWeekDate){
      this.reportWeekData[moment(this.nextWeekDate).format('MM/DD/YYYY')] = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[moment(this.nextWeekDate).format('MM/DD/YYYY'),
      moment(this.nextWeekDate).add(1,'days').format('MM/DD/YYYY'),moment(this.nextWeekDate).add(2,'days').format('MM/DD/YYYY'),
      moment(this.nextWeekDate).add(3,'days').format('MM/DD/YYYY'),moment(this.nextWeekDate).add(4,'days').format('MM/DD/YYYY'),
      moment(this.nextWeekDate).add(5,'days').format('MM/DD/YYYY'),moment(this.nextWeekDate).add(6,'days').format('MM/DD/YYYY')],[0]];
      this.getNextWeekDate1(moment(this.nextWeekDate).format('MM/DD/YYYY'));
      this.currentDate = moment(this.nextWeekDate).format('MM/DD/YYYY');
    }
  }
  addDefaultMonthData(currentDate){
    while(new Date(currentDate) > this.nextMonthDate){
      this.reportMonthData[moment(this.nextMonthDate).format('MM/DD/YYYY')] = [[0],[0],[moment(this.nextMonthDate).format('MM/DD/YYYY')],[0]];
      this.getNextMonthDate1(moment(this.nextMonthDate).format('MM/DD/YYYY'));
      this.currentDate = moment(this.nextMonthDate).format('MM/DD/YYYY');
    }
  }
  getSystemStatus(res,reportType){
    // this.reportDayData = [];
    // this.reportWeekData = [];
    // this.reportMonthData = [];
    this.reportsTime = [];
    this.reportsDate = [];
    this.totalProducts = [];
    this.defectiveProducts = [];
    this.totalWeekProducts = [];
    this.defectiveWeekProducts = [];
    this.reportsWeekTime = [];
    this.reportsWeekDate = [];
    this.totalMonthProducts = [];
    this.defectiveMonthProducts = [];
    // this.weekDates = [];
    this.nextWeekDate = undefined;
    this.nextMonthDate = undefined;
    let systemStatus = [];
    res.response = res.response.sort(function(a, b){
      return Number(a.dateTime) - Number(b.dateTime);
    })
    const startReportDate = `${res.response[1].month}/${res.response[1].day}/20${res.response[1].year}`;
      const endReportDate = `${res.response[res.response.length - 1].month}/${res.response[res.response.length - 1].day}/20${res.response[res.response.length - 1].year}`;
    if(reportType == 'day'){
      this.reportDates = [];
    }
    if(reportType == 'week'){
      this.weekDates = [];
      this.getBetweenWeeks(new Date(startReportDate), new Date(endReportDate));
    }
    if(reportType == 'month'){
      this.monthDates = [];
      this.getBetweenMonths(new Date(startReportDate), new Date(endReportDate));
    }
    
    console.log("weekdates",this.weekDates);
    console.log(res.response)
    res.response.forEach((item)=>{
      if(new Date(`${item.month}/${item.day}/20${item.year}`).toString() !== 'Invalid Date'){
        const dateData=`${item.month}/${item.day}/20${item.year}`
        const time=`${item.hour}:${item.min}`
        //for day report
        if(reportType == 'day'){
          if(!this.reportDates.includes(dateData)){
            this.reportDates.push(dateData);
            this.reportsTime = [];
            this.reportsDate = [];
            this.totalProducts = [];
            systemStatus = [];
          }
          this.reportsTime.push(time);
          this.reportsDate.push(dateData);
          systemStatus.push(15);
          this.totalProducts.push(this.getColorCode(item.eventStatus));
          this.reportDayData[dateData] = [systemStatus,this.totalProducts,this.reportsDate,this.reportsTime];
        }
        else if(reportType == 'week'){
          // for week report
          //next weekdate is empty
          if(this.nextWeekDate != undefined && new Date(dateData) < this.nextWeekDate){
            this.reportsTime.push(`${item.hour}:${item.min}`);
            this.reportsDate.push(dateData);
            this.totalProducts.push(item.eventStatus);

            this.totalWeekProducts.push(this.getColorCode(item.eventStatus));
            //this.defectiveWeekProducts.push(item.defectiveProducts);
            this.reportsWeekTime.push(time);
            this.reportsWeekDate.push(dateData);
            systemStatus.push(15)
            this.reportWeekData[this.currentDate] = [systemStatus,this.totalWeekProducts,this.reportsWeekDate,this.reportsWeekTime];
          }else{
            // if(!this.weekDates.includes(dateData)){
              //if nextweekdate is empty then current date else
              if(this.nextWeekDate == undefined){
                this.currentDate = dateData;
                this.getNextWeekDate1(dateData);
                this.addDefaultData(dateData);
              }else{
                let correctMonth = this.nextWeekDate.getMonth()+1;
                this.currentDate = ('0' + (correctMonth)).slice(-2)+'/'+('0'+this.nextWeekDate.getDate()).slice(-2)+'/'+this.nextWeekDate.getFullYear();
                this.addDefaultData(dateData);
                this.getNextWeekDate1(moment(this.nextWeekDate).format('MM/DD/YYYY'));
              }
              // when new week start clear the data
              this.totalWeekProducts = [];
              this.defectiveWeekProducts = [];
              this.reportsWeekTime = [];
              this.reportsWeekDate = [];
              systemStatus = []
            // this.addDefaultData(dateData);
            this.reportsWeekTime.push(`${item.hour}:${item.min}`);
            this.reportsWeekDate.push(dateData);
            systemStatus.push(15)
            this.totalWeekProducts.push(this.getColorCode(item.eventStatus));
            this.reportWeekData[this.currentDate] = [systemStatus,this.totalWeekProducts,this.reportsWeekDate,this.reportsWeekTime];
            // }
          }
        }
        else if(reportType == 'month'){
          if(this.nextMonthDate != undefined && new Date(dateData) < this.nextMonthDate){
            this.totalMonthProducts.push(this.getColorCode(item.eventStatus));
            this.reportsMonthTime.push(`${item.hour}:${item.min}`);
            this.reportsMonthDate.push(dateData);
            systemStatus.push(15)
            this.reportMonthData[this.currentDate] = [systemStatus,this.totalMonthProducts,this.reportsMonthDate,this.reportsMonthTime];
          }else{
            // if(!this.monthDates.includes(dateData)){
              //if nextweekdate is empty then current date else
              if(this.nextMonthDate == undefined){
                this.currentDate = dateData;
                this.getNextMonthDate1(dateData);
                this.addDefaultMonthData(dateData);
              }else{
                let correctMonth = this.nextMonthDate.getMonth()+1;
                this.currentDate = ('0' + (correctMonth)).slice(-2)+'/'+this.nextMonthDate.getDate()+'/'+this.nextMonthDate.getFullYear();
                this.addDefaultMonthData(dateData);
                this.getNextMonthDate1(moment(this.nextMonthDate).format('MM/DD/YYYY'));
              }
              // this.monthDates.push(dateData);
              // when new week start clear the data
              this.totalMonthProducts = [];
              this.defectiveMonthProducts = [];
              this.reportsMonthTime = [];
              this.reportsMonthDate = [];
              systemStatus = []
              // this.addDefaultMonthData(dateData);
              this.reportsMonthTime.push(`${item.hour}:${item.min}`);
              this.reportsMonthDate.push(dateData);
              systemStatus.push(15)
              this.totalMonthProducts.push(this.getColorCode(item.eventStatus));
              this.reportMonthData[this.currentDate] = [systemStatus,this.totalMonthProducts,this.reportsMonthDate,this.reportsMonthTime];
            // }
          }
        }
      }
      
    })
  }

  getProduction(res,reportType){
    // this.reportDayData = [];
    // this.reportWeekData = [];
    // this.reportMonthData = [];
    this.reportsTime = [];
    this.reportsDate = [];
    this.totalProducts = [];
    this.defectiveProducts = [];
    this.totalWeekProducts = [];
    this.defectiveWeekProducts = [];
    this.reportsWeekTime = [];
    this.reportsWeekDate = [];
    this.totalMonthProducts = [];
    this.defectiveMonthProducts = [];
    if(reportType == 'day'){
    this.reportDates = [];
    }
    if(reportType == 'week'){
      this.weekDates = [];
    }
    if(reportType == 'month'){
      this.monthDates = [];
    }
    // this.weekDates = [];
    this.nextWeekDate = undefined;
    this.nextMonthDate = undefined;
    res.responseArr.forEach((item)=>{
      //for day report
      if(reportType == 'day'){
        if(!this.reportDates.includes(item.date)){
          this.reportDates.push(item.date);
          this.reportsTime = [];
          this.reportsDate = [];
          this.totalProducts = [];
          this.defectiveProducts = [];
        }
        let xaxisTime = item.time.split(":");
        this.reportsTime.push(xaxisTime[0]+':'+xaxisTime[1]);
        this.reportsDate.push(item.date);
        this.totalProducts.push(item.totalProducts);
        this.defectiveProducts.push(item.defectiveProducts);
        this.reportDayData[item.date] = [this.totalProducts,this.defectiveProducts,this.reportsTime,this.reportsDate];
      }
      else if(reportType == 'week'){
        // for week report
        //next weekdate is empty
        if(this.nextWeekDate != undefined && new Date(item.date) < this.nextWeekDate){
          this.totalWeekProducts.push(item.totalProducts);
          this.defectiveWeekProducts.push(item.defectiveProducts);
          this.reportsWeekTime.push(item.time.slice(0,5));
          this.reportsWeekDate.push(item.date);
          this.reportWeekData[this.currentDate] = [this.totalWeekProducts,this.defectiveWeekProducts,this.reportsWeekTime,this.reportsWeekDate];
        }else{
          if(!this.weekDates.includes(item.date)){
            //if nextweekdate is empty then current date else
            if(this.nextWeekDate == undefined){
              this.currentDate = item.date;
              this.getNextWeekDate(item.date);
            }else{
              let correctMonth = this.nextWeekDate.getMonth()+1;
              this.currentDate = ('0' + (correctMonth)).slice(-2)+'/'+this.nextWeekDate.getDate()+'/'+this.nextWeekDate.getFullYear();
              this.getNextWeekDate(this.nextWeekDate);
            }
            this.weekDates.push(item.date);
            // when new week start clear the data
            this.totalWeekProducts = [];
            this.defectiveWeekProducts = [];
            this.reportsWeekTime = [];
            this.reportsWeekDate = [];
            this.totalWeekProducts.push(item.totalProducts);
          this.defectiveWeekProducts.push(item.defectiveProducts);
          this.reportsWeekTime.push(item.time.slice(0,5));
          this.reportsWeekDate.push(item.date);
          this.reportWeekData[this.currentDate] = [this.totalWeekProducts,this.defectiveWeekProducts,this.reportsWeekTime,this.reportsWeekDate];
          }
        }
      }
      else if(reportType == 'month'){
        if(this.nextMonthDate != undefined && new Date(item.date) < this.nextMonthDate){
          this.totalMonthProducts.push(item.totalProducts);
          this.defectiveMonthProducts.push(item.defectiveProducts);
          this.reportsMonthTime.push(item.time.slice(0,5));
          this.reportsMonthDate.push(item.date);
          this.reportMonthData[this.currentDate] = [this.totalMonthProducts,this.defectiveMonthProducts,this.reportsMonthTime,this.reportsMonthDate];
        }else{
          if(!this.monthDates.includes(item.date)){
            //if nextweekdate is empty then current date else
            if(this.nextMonthDate == undefined){
              this.currentDate = item.date;
              this.getNextMonthDate(item.date);
            }else{
              let correctMonth = this.nextMonthDate.getMonth()+1;
              this.currentDate = ('0' + (correctMonth)).slice(-2)+'/'+this.nextMonthDate.getDate()+'/'+this.nextMonthDate.getFullYear();
              this.getNextMonthDate(this.nextMonthDate);
            }
            this.monthDates.push(item.date);
            // when new week start clear the data
            this.totalMonthProducts = [];
            this.defectiveMonthProducts = [];
            this.reportsMonthTime = [];
            this.reportsMonthDate = [];
            this.totalMonthProducts.push(item.totalProducts);
          this.defectiveMonthProducts.push(item.defectiveProducts);
          this.reportsMonthTime.push(item.time.slice(0,5));
          this.reportsMonthDate.push(item.date);
          this.reportMonthData[this.currentDate] = [this.totalMonthProducts,this.defectiveMonthProducts,this.reportsMonthTime,this.reportsMonthDate];
          }
        }
      }
    })
    console.log(this.reportWeekData);
  }
  getProductionYield(res,reportType){
    // this.reportDayData = [];
    // this.reportWeekData = [];
    // this.reportMonthData = [];
    this.reportsTime = [];
    this.reportsDate = [];
    this.totalProducts = [];
    this.defectiveProducts = [];
    this.totalWeekProducts = [];
    this.defectiveWeekProducts = [];
    this.reportsWeekTime = [];
    this.reportsWeekDate = [];
    this.totalMonthProducts = [];
    this.defectiveMonthProducts = [];
    if(reportType == 'day'){
    this.reportDates = [];
    }
    if(reportType == 'week'){
      this.weekDates = [];
    }
    if(reportType == 'month'){
      this.monthDates = [];
    }
    // this.weekDates = [];
    this.nextWeekDate = undefined;
    this.nextMonthDate = undefined;
    res.responseArr.forEach((item)=>{
      //for day report
      if(reportType == 'day'){
        if(!this.reportDates.includes(item.date)){
          this.reportDates.push(item.date);
          this.reportsTime = [];
          this.reportsDate = [];
          this.totalProducts = [];
          this.defectiveProducts = [];
        }
        this.reportsTime.push(item.time);
        this.reportsDate.push(item.date);
        this.totalProducts.push(item.totalProducts);
        this.defectiveProducts.push(item.defectiveProducts);
        this.reportDayData[item.date] = [this.totalProducts,this.defectiveProducts,this.reportsTime,this.reportsDate];
      }
      else if(reportType == 'week'){
        // for week report
        //next weekdate is empty
        if(this.nextWeekDate != undefined && new Date(item.date) < this.nextWeekDate){
          this.totalWeekProducts.push(item.totalProducts);
          this.defectiveWeekProducts.push(item.defectiveProducts);
          this.reportsWeekTime.push(item.time);
          this.reportsWeekDate.push(item.date);
          this.reportWeekData[this.currentDate] = [this.totalWeekProducts,this.defectiveWeekProducts,this.reportsWeekTime,this.reportsWeekDate];
        }else{
          if(!this.weekDates.includes(item.date)){
            //if nextweekdate is empty then current date else
            if(this.nextWeekDate == undefined){
              this.currentDate = item.date;
              this.getNextWeekDate(item.date);
            }else{
              let correctMonth = this.nextWeekDate.getMonth()+1;
              this.currentDate = ('0' + (correctMonth)).slice(-2)+'/'+this.nextWeekDate.getDate()+'/'+this.nextWeekDate.getFullYear();
              this.getNextWeekDate(this.nextWeekDate);
            }
            this.weekDates.push(item.date);
            // when new week start clear the data
            this.totalWeekProducts = [];
            this.defectiveWeekProducts = [];
            this.reportsWeekTime = [];
            this.reportsWeekDate = [];
            this.totalWeekProducts.push(item.totalProducts);
          this.defectiveWeekProducts.push(item.defectiveProducts);
          this.reportsWeekTime.push(item.time);
          this.reportsWeekDate.push(item.date);
          this.reportWeekData[this.currentDate] = [this.totalWeekProducts,this.defectiveWeekProducts,this.reportsWeekTime,this.reportsWeekDate];
          }
        }
      }
      else if(reportType == 'month'){
        if(this.nextMonthDate != undefined && new Date(item.date) < this.nextMonthDate){
          this.totalMonthProducts.push(item.totalProducts);
          this.defectiveMonthProducts.push(item.defectiveProducts);
          this.reportsMonthTime.push(item.time);
          this.reportsMonthDate.push(item.date);
          this.reportMonthData[this.currentDate] = [this.totalMonthProducts,this.defectiveMonthProducts,this.reportsMonthTime,this.reportsMonthDate];
        }else{
          if(!this.monthDates.includes(item.date)){
            //if nextweekdate is empty then current date else
            if(this.nextMonthDate == undefined){
              this.currentDate = item.date;
              this.getNextMonthDate(item.date);
            }else{
              let correctMonth = this.nextMonthDate.getMonth()+1;
              this.currentDate = ('0' + (correctMonth)).slice(-2)+'/'+this.nextMonthDate.getDate()+'/'+this.nextMonthDate.getFullYear();
              this.getNextMonthDate(this.nextMonthDate);
            }
            this.monthDates.push(item.date);
            // when new week start clear the data
            this.totalMonthProducts = [];
            this.defectiveMonthProducts = [];
            this.reportsMonthTime = [];
            this.reportsMonthDate = [];
            this.totalMonthProducts.push(item.totalProducts);
            this.defectiveMonthProducts.push(item.defectiveProducts);
            this.reportsMonthTime.push(item.time);
            this.reportsMonthDate.push(item.date);
            this.reportMonthData[this.currentDate] = [this.totalMonthProducts,this.defectiveMonthProducts,this.reportsMonthTime,this.reportsMonthDate];
          }
        }
      }
    })
    console.log(this.reportWeekData);
  }

  getNextWeekDate(currentdate){
    this.nextWeekDate = new Date(currentdate);
    this.nextWeekDate.setDate(this.nextWeekDate.getDate() + 7);
  }
  getNextMonthDate(currentdate){
    this.nextMonthDate = new Date(currentdate);
    this.nextMonthDate.setMonth(this.nextMonthDate.getMonth() + 1 );
  }
  productionGraph(label,currentDate){
    // this.previousDate="";
    
    let labels;
    let lineData1;
    let lineData2;
    let numGraphs;
    let graphData;
    let graphlabel;
    let xaxislabel;
    let xaxisticks;
    if(label == "WEEK_VIEW"){
      numGraphs = this.weekDates;
      graphData = this.reportWeekData;
      graphlabel = label;
      xaxislabel = 3;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 13,
        fontColor: '#000'
      }
    }else if(label == "MONTH_VIEW"){
      numGraphs = this.monthDates;
      graphData = this.reportMonthData;
      graphlabel = label;
      xaxislabel = 3;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 13,
        fontColor: '#000'
      }
    }
    else{
      numGraphs = this.reportDates;
      graphData = this.reportDayData;
      graphlabel = "DAY_VIEW";
      xaxislabel = 2;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 13,
        maxRotation: 0,
        minRotation: 0,
        fontColor: '#000'
      }
    }
    numGraphs.forEach((item,index)=>{
      console.log(item);
      labels = graphData[item][xaxislabel];
      lineData1 = graphData[item][0];
      lineData2 = graphData[item][1];
      label = graphlabel+(index+1);
      // this.canvas = document.getElementById(label);
      // this.ctx = this.canvas.getContext('2d');
      this.productionChart[graphlabel] = new Chart(label, 
        {
          type: 'line',
          width: 600,
          data: {
            labels: labels,
            datasets: [
              {
                data: lineData1,
                borderColor: '#FF0000',
                backgroundColor: "#FF0000",
                fill:false,
                label: 'Production Count',
                pointRadius: 0
              },
              {
                data: lineData2,
                borderColor: '#F2C714',
                backgroundColor: "#F2C714",
                fill:false,
                label: 'Defect Count',
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            stacked: false,
            legend:{
              display:true,
              position:'bottom',
              labels: {
                padding: 50,
                boxWidth: 8,
                fontColor:'#5C5C5C',
                fontSize: 16
              }
            },
            title: {
                display: false,
            },
            scales: {
                yAxes: [{
                        ticks: {
                            fontSize: 20,
                            fontColor: '#000000',
                            autoSkip: false,
                            display: false
                        },
                        scaleLabel: {
                          display: true,
                          fontColor:'#0D446D',
                          labelString: 'Production Count'
                        },
                        gridLines: {
                          display:false
                        }
                    }],
                xAxes: [{
                        // aqui controlas la cantidad de elementos en el eje horizontal con autoSkip
                        ticks: xaxisticks,
                        gridLines: {
                          display:true
                        }
                      }]
            }
          }
        }
      );
    })
  }
  getTotalAdhesiveAddOn(res,reportType){
    // this.reportDayData = [];
    // this.reportWeekData = [];
    // this.reportMonthData = [];
    this.reportsTime = [];
    this.reportsDate = [];
    this.totalProducts = [];
    this.totalWeekProducts = [];
    this.reportsWeekTime = [];
    this.reportsWeekDate = [];
    this.totalMonthProducts = [];
    if(reportType == 'day'){
    this.reportDates = [];
    }
    if(reportType == 'week'){
      this.weekDates = [];
    }
    if(reportType == 'month'){
      this.monthDates = [];
    }
    this.nextWeekDate = undefined;
    this.nextMonthDate = undefined;
    let arrayLength = res.responseArr.length;
    let atsAlertLowerLimit = [];
    let atsAlertUpperLimit = [];
    let atsFaultLowerLimit = [];
    let atsFaultUpperLimit = [];
    if(reportType == 'day'){
      this.generalAddon = res.responseArr[arrayLength - 1].ATSTargetAddon;
      this.generalAverage = res.responseArr[arrayLength - 1].avgPerProduct;
      this.generalTotal = res.responseArr[arrayLength - 1].totalNumOfProduct;
      this.generalLimit = res.responseArr[arrayLength - 1].productOutOfLimit;
    }else if(reportType == 'week'){
      this.generalWeekAddon = res.responseArr[arrayLength - 1].ATSTargetAddon;
      this.generalWeekAverage = res.responseArr[arrayLength - 1].avgPerProduct;
      this.generalWeekTotal = res.responseArr[arrayLength - 1].totalNumOfProduct;
      this.generalWeekLimit = res.responseArr[arrayLength - 1].productOutOfLimit;
    }else if(reportType == 'month'){
      this.generalMonthAddon = res.responseArr[arrayLength - 1].ATSTargetAddon;
      this.generalMonthAverage = res.responseArr[arrayLength - 1].avgPerProduct;
      this.generalMonthTotal = res.responseArr[arrayLength - 1].totalNumOfProduct;
      this.generalMonthLimit = res.responseArr[arrayLength - 1].productOutOfLimit;
    }
    res.responseArr.forEach((item)=>{
      //for day report
      if(reportType == 'day'){
        if(item.addOnPerProduct != undefined){
          if(!this.reportDates.includes(item.date)){
            this.reportDates.push(item.date);
            this.reportsTime = [];
            this.reportsDate = [];
            this.totalProducts = [];
            atsAlertLowerLimit = [];
              atsAlertUpperLimit = [];
              atsFaultLowerLimit = [];
              atsFaultUpperLimit = [];
          }
          let xaxisTime = item.time.split(":");
          this.reportsTime.push(xaxisTime[0]+':'+xaxisTime[1]);
          this.reportsDate.push(item.date);
          this.totalProducts.push(item.addOnPerProduct);
          atsAlertLowerLimit.push(Number(res.responseArr[arrayLength - 1].ATSAlertLowerLimit));
          atsAlertUpperLimit.push(Number(res.responseArr[arrayLength - 1].ATSAlertUpperLimit));
          atsFaultLowerLimit.push(Number(res.responseArr[arrayLength - 1].ATSFaultLowerLimit));
          atsFaultUpperLimit.push(Number(res.responseArr[arrayLength - 1].ATSFaultUpperLimit));
        
          this.reportDayData[item.date] = [this.totalProducts,atsAlertLowerLimit,atsAlertUpperLimit,atsFaultLowerLimit,atsFaultUpperLimit,this.reportsTime,this.reportsDate];
        }
      }
      else if(reportType == 'week'){
        // for week report
        //next weekdate is empty
        if(this.nextWeekDate != undefined && new Date(item.date) < this.nextWeekDate && item.date != undefined){
          if(item.addOnPerProduct != undefined){
            this.totalWeekProducts.push(item.addOnPerProduct);
            this.reportsWeekTime.push(item.time.slice(0,5));
            this.reportsWeekDate.push(item.date);
            atsAlertLowerLimit.push(Number(res.responseArr[arrayLength - 1].ATSAlertLowerLimit));
            atsAlertUpperLimit.push(Number(res.responseArr[arrayLength - 1].ATSAlertUpperLimit));
            atsFaultLowerLimit.push(Number(res.responseArr[arrayLength - 1].ATSFaultLowerLimit));
            atsFaultUpperLimit.push(Number(res.responseArr[arrayLength - 1].ATSFaultUpperLimit));
          
            this.reportWeekData[this.currentDate] = [this.totalWeekProducts,atsAlertLowerLimit,atsAlertUpperLimit,atsFaultLowerLimit,atsFaultUpperLimit,this.reportsWeekTime,this.reportsWeekDate];
          }
        }else{
          if(!this.weekDates.includes(item.date)){
            //if nextweekdate is empty then current date else
            if(item.addOnPerProduct != undefined){
              if(this.nextWeekDate == undefined){
                this.currentDate = item.date;
                this.getNextWeekDate(item.date);
              }else{
                let correctMonth = this.nextWeekDate.getMonth()+1;
                this.currentDate = ('0' + (correctMonth)).slice(-2)+'/'+this.nextWeekDate.getDate()+'/'+this.nextWeekDate.getFullYear();
                this.getNextWeekDate(this.nextWeekDate);
              }
              this.weekDates.push(item.date);
              // when new week start clear the data
              this.totalWeekProducts = [];
              this.reportsWeekTime = [];
              this.reportsWeekDate = [];
              atsAlertLowerLimit = [];
              atsAlertUpperLimit = [];
              atsFaultLowerLimit = [];
              atsFaultUpperLimit = [];
              this.totalWeekProducts.push(item.addOnPerProduct);
            this.reportsWeekTime.push(item.time.slice(0,5));
            this.reportsWeekDate.push(item.date);
            atsAlertLowerLimit.push(Number(res.responseArr[arrayLength - 1].ATSAlertLowerLimit));
            atsAlertUpperLimit.push(Number(res.responseArr[arrayLength - 1].ATSAlertUpperLimit));
            atsFaultLowerLimit.push(Number(res.responseArr[arrayLength - 1].ATSFaultLowerLimit));
            atsFaultUpperLimit.push(Number(res.responseArr[arrayLength - 1].ATSFaultUpperLimit));
            this.reportWeekData[this.currentDate] = [this.totalWeekProducts,atsAlertLowerLimit,atsAlertUpperLimit,atsFaultLowerLimit,atsFaultUpperLimit,this.reportsWeekTime,this.reportsWeekDate];
          }
          }
        }
      }
      else if(reportType == 'month'){
        if(this.nextMonthDate != undefined && new Date(item.date) < this.nextMonthDate){
          if(item.addOnPerProduct != undefined){
            this.totalMonthProducts.push(item.addOnPerProduct);
            this.reportsMonthTime.push(item.time.slice(0,5));
            this.reportsMonthDate.push(item.date);
            atsAlertLowerLimit.push(Number(res.responseArr[arrayLength - 1].ATSAlertLowerLimit));
            atsAlertUpperLimit.push(Number(res.responseArr[arrayLength - 1].ATSAlertUpperLimit));
            atsFaultLowerLimit.push(Number(res.responseArr[arrayLength - 1].ATSFaultLowerLimit));
            atsFaultUpperLimit.push(Number(res.responseArr[arrayLength - 1].ATSFaultUpperLimit));
          
            this.reportMonthData[this.currentDate] = [this.totalMonthProducts,atsAlertLowerLimit,atsAlertUpperLimit,atsFaultLowerLimit,atsFaultUpperLimit,this.reportsMonthTime,this.reportsMonthDate];
          }
        }else{
          if(!this.monthDates.includes(item.date)){
            //if nextweekdate is empty then current date else
            if(item.addOnPerProduct != undefined){
              if(this.nextMonthDate == undefined){
                this.currentDate = item.date;
                this.getNextMonthDate(item.date);
              }else{
                let correctMonth = this.nextMonthDate.getMonth()+1;
                this.currentDate = ('0' + (correctMonth)).slice(-2)+'/'+this.nextMonthDate.getDate()+'/'+this.nextMonthDate.getFullYear();
                this.getNextMonthDate(this.nextMonthDate);
              }
              this.monthDates.push(item.date);
              // when new week start clear the data
              this.totalMonthProducts = [];
              this.reportsMonthTime = [];
              this.reportsMonthDate = [];
              atsAlertLowerLimit = [];
              atsAlertUpperLimit = [];
              atsFaultLowerLimit = [];
              atsFaultUpperLimit = [];
              this.totalMonthProducts.push(item.addOnPerProduct);
              this.reportsMonthTime.push(item.time.slice(0,5));
              this.reportsMonthDate.push(item.date);
              atsAlertLowerLimit.push(Number(res.responseArr[arrayLength - 1].ATSAlertLowerLimit));
              atsAlertUpperLimit.push(Number(res.responseArr[arrayLength - 1].ATSAlertUpperLimit));
              atsFaultLowerLimit.push(Number(res.responseArr[arrayLength - 1].ATSFaultLowerLimit));
              atsFaultUpperLimit.push(Number(res.responseArr[arrayLength - 1].ATSFaultUpperLimit));
            
              this.reportMonthData[this.currentDate] = [this.totalMonthProducts,atsAlertLowerLimit,atsAlertUpperLimit,atsFaultLowerLimit,atsFaultUpperLimit,this.reportsMonthTime,this.reportsMonthDate];
            }
          }
        }
      }
    })
  }
  totalAdhesiveAddOnGraph(label,currentDate){
    let labels;
    let lineData1;
    let lineData2;
    let lineData3;
    let lineData4;
    let lineData5;
    let numGraphs;
    let graphData;
    let graphlabel;
    let xaxislabel;
    let xaxisticks;
    if(label == "WEEK_VIEW"){
      numGraphs = this.weekDates;
      graphData = this.reportWeekData;
      graphlabel = label;
      xaxislabel = 6;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 13,
        fontColor: '#000'
      }
    }else if(label == "MONTH_VIEW"){
      numGraphs = this.monthDates;
      graphData = this.reportMonthData;
      graphlabel = label;
      xaxislabel = 6;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 13,
        fontColor: '#000'
      }
    }
    else{
      numGraphs = this.reportDates;
      graphData = this.reportDayData;
      graphlabel = "DAY_VIEW";
      xaxislabel = 5;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 13,
        maxRotation: 0,
        minRotation: 0,
        fontColor: '#000'
      }
    }
    numGraphs.forEach((item,index)=>{
      console.log(item);
      labels = graphData[item][xaxislabel];
      lineData1 = graphData[item][0];
      lineData2 = graphData[item][1];
      lineData3 = graphData[item][2];
      lineData4 = graphData[item][3];
      lineData5 = graphData[item][4];
      label = graphlabel+(index+1);
      this.productionChart[graphlabel] = new Chart(label, 
        {
          type: 'line',
          width: 600,
          data: {
            labels: labels,
            datasets: [
              {
                data: lineData1,
                borderColor: '#02940B',
                backgroundColor: "#02940B",
                borderDash: [10,5],
                fill:false,
                label: 'Target',
                pointRadius: 0
              },
              {
                data: lineData2,
                borderColor: '#F2C714',
                backgroundColor: "#F2C714",
                borderDash: [10,5],
                fill:false,
                label: 'Alert',
                pointRadius: 0
              },
              {
                data: lineData3,
                borderColor: '#F2C714',
                backgroundColor: "#F2C714",
                borderDash: [10,5],
                fill:false,
                label: 'Alert',
                pointRadius: 0
              },
              {
                data: lineData4,
                borderColor: '#FF0000',
                backgroundColor: "#FF0000",
                borderDash: [10,5],
                fill:false,
                label: 'Fault/Stop',
                pointRadius: 0
              },
              {
                data: lineData5,
                borderColor: '#FF0000',
                backgroundColor: "#FF0000",
                borderDash: [10,5],
                fill:false,
                label: 'Fault/Stop',
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            stacked: false,
            legend:{

              display:true,
              position:'bottom',
              labels: {
                filter: function(legendItem, chartData) {
                  if (legendItem.datasetIndex === 2 || legendItem.datasetIndex === 4) {
                    return false;
                  }
                 return true;
                 },
                 generateLabels: chart => chart.data.datasets.map((dataset, i) => ({
                  datasetIndex: i,
                  text: dataset.label,
                  fillStyle: dataset.backgroundColor,
                  strokeStyle: dataset.borderColor
                })),
                padding: 50,
                boxWidth: 8,
                fontColor:'#5C5C5C',
                fontSize: 16
              }
            },
            title: {
                display: false,
            },
            scales: {
              yAxes: [{
                ticks: {
                    fontSize: 10,
                    fontColor: '#000000',
                    autoSkip: false,
                    display: false
                },
                scaleLabel: {
                  display: true,
                  fontColor:'#0D446D',
                  labelString: 'Add-on Weight',
                  fontStyle: 'normal',
                  fontSize: 14                },
                gridLines: {
                  display:false
                }
              }],
              xAxes: [{
                // aqui controlas la cantidad de elementos en el eje horizontal con autoSkip
                ticks: xaxisticks,
                gridLines: {
                  display:true
                }
              }]
            }
          }
        }
      );
    })
  }
  productionYieldGraph(label,currentDate){
    let labels;
    let lineData1;
    let lineData2;
    let lineData3;
    let lineData4;
    let lineData5;
    let numGraphs;
    let graphData;
    let graphlabel;
    let xaxislabel;
    if(label == "WEEK_VIEW"){
      numGraphs = this.weekDates;
      graphData = this.reportWeekData;
      graphlabel = label;
      xaxislabel = 6;
 
    }else if(label == "MONTH_VIEW"){
      numGraphs = this.monthDates;
      graphData = this.reportMonthData;
      graphlabel = label;
      xaxislabel = 6;
    }
    else{
      numGraphs = this.reportDates;
      graphData = this.reportDayData;
      graphlabel = "DAY_VIEW";
      xaxislabel = 5;

    }
    let totalProductCount;
    let totalDefetiveProductCount;
    numGraphs.forEach((item,index)=>{
      labels = graphData[item][xaxislabel];
      lineData1 = graphData[item][0];
      lineData2 = graphData[item][1];
      lineData3 = graphData[item][2];
      lineData4 = graphData[item][3];
      lineData5 = graphData[item][4];
      label = graphlabel+(index+1);
      totalProductCount=graphData[item][0]
      totalDefetiveProductCount=graphData[item][1]
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      this.productionChart[graphlabel] = new Chart(label, 
        {
          type: 'pie',
          width: 600,
          data: {
            datasets: [
              {
                data: [totalProductCount.reduce(reducer),totalDefetiveProductCount.reduce(reducer)],
                borderColor: '#02940B',
                backgroundColor: ['#0071BE', '#F5A623'],
                borderDash: [10,5],
                fill:false,
              }
            ],
            labels: ["Products: " + totalProductCount.reduce(reducer) + ", Yield %: " + Math.round(graphData[item][0][0] * 10) / 10 + '%', "Defects: " + totalDefetiveProductCount.reduce(reducer) + ", Yield %: " + Math.round(graphData[item][1][0] * 10) / 10 + '%']
          },
          options: {
            responsive: true,
            width: 500,
            height: 600,
            stacked: false,
            legend:{
              display:false,
              position:'bottom',
              boxWidth: 10
            },
            title: {
                display: false,
            }
          }
        }
      );
    })
  }
  // getTimeLabels(labels){
  //   labels = ["19:10","19:20","19:00","18:44", "18:44", "18:45", "18:45", "18:45", "18:45", "18:45", "18:45", "18:45", "18:45", "18:45", "18:45", "18:45", "18:45", "18:46", "18:46", "18:46", "18:46", "18:46", "18:46", "18:46", "18:46", "18:46", "18:46", "18:46", "18:46", "18:47", "18:47", "18:47", "18:47", "18:47", "18:47", "18:47", "18:47", "18:47", "18:47", "18:47", "18:47", "18:48", "18:48", "18:48", "18:48", "18:48"]
  //   console.log("before",labels);
  //   labels = labels.sort((a, b)=>{
  //     return Number(a) - Number(b);
  //   })
  //   console.log("after",labels);
  // }
  systemStatusGraph(label,currentDate){
    let labels;
    let lineData1;
    let numGraphs;
    let graphData;
    let graphlabel;
    let xaxislabel;
    let xaxisticks;
    if(label == "WEEK_VIEW"){
      numGraphs = this.weekDates;
      graphData = this.reportWeekData;
      graphlabel = label;
      xaxislabel = 2;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 7,
        fontColor: '#000'
      }
    }else if(label == "MONTH_VIEW"){
      numGraphs = this.monthDates;
      graphData = this.reportMonthData;
      graphlabel = label;
      xaxislabel = 2;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 10,
        fontColor: '#000'
      }
    }
    else{
      numGraphs = this.reportDates;
      graphData = this.reportDayData;
      graphlabel = "DAY_VIEW";
      xaxislabel = 3;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 13,
        maxRotation: 0,
        minRotation: 0,
        fontColor: '#000'
      }

    }
    console.log("graphData",graphData)
    let totalProductCount;
    let totalDefetiveProductCount;
    numGraphs.forEach((item,index)=>{
      // labels = this.getTimeLabels(graphData[item][xaxislabel]);
      labels = graphData[item][xaxislabel];
      // labels = ['00:00','01:15', '02:00', '03:20', '04:00', '05:00', '06:00','07:00','08:00','09:00','10:00','11:00',
      // '12:00','13:00','14:00','15:00','16:00','17:00','18:00','23:59'];

      lineData1 = graphData[item][0];
      label = graphlabel+(index+1);
      var data = {
        labels: labels,
        datasets: [{
                label: "",
                backgroundColor:graphData[item][1],
                data: lineData1,
                fill: false,
                categoryPercentage: 1.0,
                barPercentage: 1.0
        }]
    };
    // if(index==numGraphs.length-1){
    //   this.loading=false;
    // }
    // else {
    //   this.loading=true;
    // }
    this.systemStatusGraph[graphlabel] = new Chart(label, {
      type: 'bar',
      width: 600,
      data,
      options: {
        responsive: true,
        stacked: false,
        legend:{
          display:false,
          position:'bottom',
          boxWidth: 10
        },
        title: {
            display: true,
        },
        scales: {
          yAxes: [{
            ticks: {
              display: false,
              beginAtZero:true
          },
            gridLines: {
              zeroLineColor: '#000',
              color: "rgba(0, 0, 0, 0)",
            }, 
              }],
          xAxes: [{
                  display: true,
                  ticks: xaxisticks,
                  gridLines: {
                    zeroLineColor: 'transparent',
                    color: "rgba(0, 0, 0, 0)",
                  },
                  
              }]
      }
      }
    });
      
    })
  }
  getTotalAdhesive(res,reportType){
    this.reportsTime = [];
    this.reportsDate = [];
    this.totalProducts = [];
    this.totalWeekProducts = [];
    this.reportsWeekTime = [];
    this.reportsWeekDate = [];
    this.totalMonthProducts = [];
    if(reportType == 'day'){
    this.reportDates = [];
    }
    if(reportType == 'week'){
      this.weekDates = [];
    }
    if(reportType == 'month'){
      this.monthDates = [];
    }
    // this.weekDates = [];
    this.nextWeekDate = undefined;
    this.nextMonthDate = undefined;
    res.responseArr.forEach((item)=>{
      //for day report
      if(reportType == 'day'){
        if(!this.reportDates.includes(item.date)){
          this.reportDates.push(item.date);
          this.reportsTime = [];
          this.reportsDate = [];
          this.totalProducts = [];
          this.defectiveProducts = [];
        }
        let xaxisTime = item.time.split(":");
        this.reportsTime.push(xaxisTime[0]+':'+xaxisTime[1]);
        this.reportsDate.push(item.date);
        this.totalProducts.push(item.totAdhesivePerHour);
        this.reportDayData[item.date] = [this.totalProducts,this.reportsTime,this.reportsDate];
      }
      else if(reportType == 'week'){
        // for week report
        //next weekdate is empty
        if(this.nextWeekDate != undefined && new Date(item.date) < this.nextWeekDate){
          this.totalWeekProducts.push(item.totAdhesivePerHour);
          this.reportsWeekTime.push(item.time.slice(0,5));
          this.reportsWeekDate.push(item.date);
          this.reportWeekData[this.currentDate] = [this.totalWeekProducts,this.reportsWeekTime,this.reportsWeekDate];
        }else{
          if(!this.weekDates.includes(item.date)){
            //if nextweekdate is empty then current date else
            if(this.nextWeekDate == undefined){
              this.currentDate = item.date;
              this.getNextWeekDate(item.date);
            }else{
              let correctMonth = this.nextWeekDate.getMonth()+1;
              this.currentDate = ('0' + (correctMonth)).slice(-2)+'/'+this.nextWeekDate.getDate()+'/'+this.nextWeekDate.getFullYear();
              this.getNextWeekDate(this.nextWeekDate);
            }
            this.weekDates.push(item.date);
            // when new week start clear the data
            this.totalWeekProducts = [];
            this.defectiveWeekProducts = [];
            this.reportsWeekTime = [];
            this.reportsWeekDate = [];
            this.totalWeekProducts.push(item.totAdhesivePerHour);
          this.reportsWeekTime.push(item.time.slice(0,5));
          this.reportsWeekDate.push(item.date);
          this.reportWeekData[this.currentDate] = [this.totalWeekProducts,this.reportsWeekTime,this.reportsWeekDate];
          }
        }
      }
      else if(reportType == 'month'){
        if(this.nextMonthDate != undefined && new Date(item.date) < this.nextMonthDate){
          this.totalMonthProducts.push(item.totAdhesivePerHour);
          this.reportsMonthTime.push(item.time.slice(0,5));
          this.reportsMonthDate.push(item.date);
          this.reportMonthData[this.currentDate] = [this.totalMonthProducts,this.reportsMonthTime,this.reportsMonthDate];
        }else{
          if(!this.monthDates.includes(item.date)){
            //if nextweekdate is empty then current date else
            if(this.nextMonthDate == undefined){
              this.currentDate = item.date;
              this.getNextMonthDate(item.date);
            }else{
              let correctMonth = this.nextMonthDate.getMonth()+1;
              this.currentDate = ('0' + (correctMonth)).slice(-2)+'/'+this.nextMonthDate.getDate()+'/'+this.nextMonthDate.getFullYear();
              this.getNextMonthDate(this.nextMonthDate);
            }
            this.monthDates.push(item.date);
            // when new week start clear the data
            this.totalMonthProducts = [];
            this.defectiveMonthProducts = [];
            this.reportsMonthTime = [];
            this.reportsMonthDate = [];
            this.totalMonthProducts.push(item.totAdhesivePerHour);
          this.reportsMonthTime.push(item.time.slice(0,5));
          this.reportsMonthDate.push(item.date);
          this.reportMonthData[this.currentDate] = [this.totalMonthProducts,this.reportsMonthTime,this.reportsMonthDate];
          }
        }
      }
    })
  }
  totalAdhesiveGraph(label,currentDate){
    // this.previousDate="";
    
    let labels;
    let lineData1;
    let lineData2;
    let numGraphs;
    let graphData;
    let graphlabel;
    let xaxislabel;
    let xaxisticks;
    if(label == "WEEK_VIEW"){
      numGraphs = this.weekDates;
      graphData = this.reportWeekData;
      graphlabel = label;
      xaxislabel = 2;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 13,
        fontColor: '#000'
      }
    }else if(label == "MONTH_VIEW"){
      numGraphs = this.monthDates;
      graphData = this.reportMonthData;
      graphlabel = label;
      xaxislabel = 2;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 13,
        fontColor: '#000'
      }
    }
    else{
      numGraphs = this.reportDates;
      graphData = this.reportDayData;
      graphlabel = "DAY_VIEW";
      xaxislabel = 1;
      xaxisticks = {
        autoSkip: true,
        maxTicksLimit: 13,
        maxRotation: 0,
        minRotation: 0,
        fontColor: '#000'
      }
    }
    numGraphs.forEach((item,index)=>{
      labels = graphData[item][xaxislabel];
      lineData1 = graphData[item][0];
      label = graphlabel+(index+1);
      // this.canvas = document.getElementById(label);
      // this.ctx = this.canvas.getContext('2d');
      this.totalAdhesiveChart = new Chart(label, 
        {
          type: 'line',
          width: 600,
          data: {
            labels: labels,
            datasets: [
              {
                data: lineData1,
                borderColor: '#0071BE',
                backgroundColor: "#0071BE",
                fill:true,
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            stacked: false,
            legend:{
              display:false,
            },
            title: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                      fontSize: 10,
                      fontColor: '#000000',
                      autoSkip: false,
                      display: true
                    },
                    gridLines: {
                      display:false
                    }
                    }],
                    xAxes: [{
                      ticks: xaxisticks,
                      gridLines: {
                        display:true
                      }
                    }]
            }
          }
        }
      );
    })
  }
  onSubmit(){}
}

@Component({
  selector: 'nordson-productYield-modal',
  templateUrl: './productYieldModal.html',
  styleUrls: ['./reports.component.css']
})
export class ProductionYieldModal implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<ProductionYieldModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private authService: AuthService,

  ) {}
  ngOnInit(){

  }
  onClick() {
    // this.authService.logout();
    this.dialogRef.close();
    // this.Router.navigate(['/']);
  }
  onNoClick(){
    this.dialogRef.close();

  }

}