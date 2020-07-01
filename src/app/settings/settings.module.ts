import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemperatureSettingsComponent } from './temperature-settings/temperature-settings.component';
import { FillComponent } from './fill/fill.component';
import { PumpComponent } from './pump/pump.component';
import { SystemIOComponent } from './system-io/system-io.component';
import { ZoneComponent } from './zone/zone.component';
import { ShareModule } from '../share/share.module';
import { NetworkingComponent } from '../tools/networking/networking.component';
import { PublicWiredNetworkComponent } from './public-wired-network/public-wired-network.component';
import { PlcComponent } from './plc/plc.component';
import { WifiComponent } from './wifi/wifi.component';
import { WebServerComponent } from './web-server/web-server.component';
import { PreferencesComponent } from '../tools/preferences/preferences.component';
import { SystemInputComponent } from './system-input/system-input.component';
import { SystemOutputComponent } from './system-output/system-output.component';
import { PressureComponent } from './pressure/pressure.component';
import { TempZoneComponent } from './temp-zone/temp-zone.component';
import { PressureOutputSettingsComponent } from '../pressure-output-settings/pressure-output-settings.component';

const routes: Routes = [
    { path: 'temperaturesettings',component: TemperatureSettingsComponent},
    { path: 'fill', component: FillComponent},
    { path: 'pump', component: PumpComponent},
    { path: 'system-io', component: SystemIOComponent},
    { 
        path: 'networking',
        // child routes
        children:[
            {path:'',component:NetworkingComponent},
            {path: 'plc', component: PlcComponent},
            {path: 'wifi', component: WifiComponent},
            {path: 'web-server', component: WebServerComponent},
            {path: 'public-wired-network', component: PublicWiredNetworkComponent},
        ]
    },
    { path: 'preferences' ,component:PreferencesComponent},
    { path: 'zone', component: ZoneComponent},
    { path: 'system-io/system-input',component: SystemInputComponent},
    { path: 'system-io/system-output',component: SystemOutputComponent},
    { 
        path: 'pressure',
        children:[
            {path: '', component: PressureComponent},
            {path:'pressure-output-settings',component:PressureOutputSettingsComponent}
        ]
    },
    { path: 'temp-zone', component: TempZoneComponent},
    // { path: 'public-wired-network', component: PublicWiredNetworkComponent},
    // { path: 'plc', component: PlcComponent},
    // { path: 'wifi', component: WifiComponent},
    // { path: 'web-server', component: WebServerComponent }
]
@NgModule({
    imports: [ShareModule,RouterModule.forChild(routes)],
    exports: [],
    declarations: [TemperatureSettingsComponent,
                   FillComponent,
                   PumpComponent,
                   SystemIOComponent,
                   ZoneComponent,
                   PreferencesComponent,
                   NetworkingComponent,
                   SystemInputComponent,
                   SystemOutputComponent,
                   PressureComponent,
                   TempZoneComponent,
                   PublicWiredNetworkComponent,
                   PlcComponent,
                   WifiComponent,
                   WebServerComponent,
                   PressureOutputSettingsComponent
                ],
})
export class SettingsModule { }