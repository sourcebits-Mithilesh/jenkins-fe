import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'nordson-system-configuration',
  templateUrl: './system-configuration.component.html',
  styleUrls: ['./system-configuration.component.css']
})
export class SystemConfigurationComponent implements OnInit {
  // LVCVer:string;
  systemInfo = [];
  dat:any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getxmlData().subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.authService.setNorId(data.result.nor_id);
          this.dat = data.result.systemInfo.DATName.Value;
          const systemInfo = data.result.systemInfo;
          this.systemInfo.push(
            {
              software: 'Low Voltage Controller Version',
              applicationversion:
                systemInfo.hasOwnProperty('LVCVer') === true
                  ? systemInfo.LVCVer.Value
                  : '0',
              bootversion:
                systemInfo.hasOwnProperty('LVCBootVer') === true
                  ? systemInfo.LVCBootVer.Value
                  : '0',
              hardwarerevision:
                systemInfo.hasOwnProperty('LVCHWRev') === true
                  ? systemInfo.LVCHWRev.Value
                  : '0'
            },
            {
              software: 'Basic UI Version',
              applicationversion:
                systemInfo.hasOwnProperty('BUIVer') === true
                  ? systemInfo.BUIVer.Value
                  : '0',
              bootversion:
                systemInfo.hasOwnProperty('BUIBootVer') === true
                  ? systemInfo.BUIBootVer.Value
                  : '0',
              hardwarerevision:
                systemInfo.hasOwnProperty('BUIHWRev') === true
                  ? systemInfo.BUIHWRev.Value
                  : '0'
            },
            {
              software: 'Temperature Board 1 Version',
              applicationversion:
                systemInfo.hasOwnProperty('TMPCTRVerBd1') === true
                  ? systemInfo.TMPCTRVerBd1.Value
                  : '0',
              bootversion:
                systemInfo.hasOwnProperty('TMPCTRBootVerBd1') === true
                  ? systemInfo.TMPCTRBootVerBd1.Value
                  : '0',
              hardwarerevision:
                systemInfo.hasOwnProperty('TMPCTRHWRevBd1') === true
                  ? systemInfo.TMPCTRHWRevBd1.Value
                  : '0'
            },
            {
              software: 'Temperature Board 2 Version',
              applicationversion:
                systemInfo.hasOwnProperty('TMPCTRVerBd2') === true
                  ? systemInfo.TMPCTRVerBd2.Value
                  : '0',
              bootversion:
                systemInfo.hasOwnProperty('TMPCTRBootVerBd2') === true
                  ? systemInfo.TMPCTRBootVerBd2.Value
                  : '0',
              hardwarerevision:
                systemInfo.hasOwnProperty('TMPCTRHWRevBd2') === true
                  ? systemInfo.TMPCTRHWRevBd2.Value
                  : '0'
            },
            {
              software: 'Temperature Board 3 Version',
              applicationversion:
                systemInfo.hasOwnProperty('TMPCTRVerBd3') === true
                  ? systemInfo.TMPCTRVerBd3.Value
                  : '0',
              bootversion:
                systemInfo.hasOwnProperty('TMPCTRBootVerBd3') === true
                  ? systemInfo.TMPCTRBootVerBd3.Value
                  : '0',
              hardwarerevision:
                systemInfo.hasOwnProperty('TMPCTRHWRevBd3') === true
                  ? systemInfo.TMPCTRHWRevBd3.Value
                  : '0'
            },
            {
              software: 'Temperature Board 4 Version',
              applicationversion:
                systemInfo.hasOwnProperty('TMPCTRVerBd4') === true
                  ? systemInfo.TMPCTRVerBd4.Value
                  : '0',
              bootversion:
                systemInfo.hasOwnProperty('TMPCTRBootVerBd4') === true
                  ? systemInfo.TMPCTRBootVerBd4.Value
                  : '0',
              hardwarerevision:
                systemInfo.hasOwnProperty('TMPCTRHWRevBd4') === true
                  ? systemInfo.TMPCTRHWRevBd4.Value
                  : '0'
            }
          );
        }
      },
      (err: any) => {
        console.error('err', err);
      }
    );
  }
}
