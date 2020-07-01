import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'nordson-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  headerStatus = false;
  sideNavDashboard = false;
  sideNaveSettings = false;
  sideNavAdmin = false;
  @Output() parentLoader = new EventEmitter();
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      this.enableNavbar(this.router.url);
    });
  }
  enableNavbar(routerName) {
    let dashboard = [
      '/dashboard',
      '/equipment-registration',
      '/manage-subuser',
      '/subuser',
      '/user-profile',
      '/imported-settings-files',
      '/event-log-files',
      '/media-center',
      '/setuptool',
      '/contactUs',
    ];
    let admin = [
      '/superadmin/superadmin-dashboard',
      '/Admin/admin-dashboard',
      '/Admin/admin-users',
      '/tech/tech-support',
      '/tech/tech-user',
      '/nor-files'
    ];
    let settings = [
      '/settings/temp-zone',
      '/settings/temperaturesettings',
      '/settings/fill',
      '/flow',
      '/flow-runtime',
      '/settings/pressure',
      '/settings/pressure/pressure-output-settings',
      '/settings/pump',
      '/security',
      '/settings/system-io',
      '/settings/zone',
      '/user-management/modify-privilage',
      '/settings/system-io/system-input',
      '/settings/system-io/system-output',
      '/tools/system-configuration-main/accessories',
      '/settings/preferences',
      '/user-profile',
      '/tools/system-configuration-main/system-configuration',
      '/tools/flow',
      '/tools/system-configuration-main/software-license',
      '/tools/maintenance',
      '/tools/maintenance/maintenance-history',
      '/tools/maintenance/maintenance-status',
      '/scheduler/heat-schedule',
      '/scheduler/shift-schedule',
      '/tools/system-configuration-main/configuration-code',
      '/settings/networking',
      '/settings/networking/public-wired-network',
      '/settings/networking/plc',
      '/settings/networking/wifi',
      '/settings/networking/web-server',
      '/tools/system-configuration-main',
      '/tools/eventLog',
      '/tools/network',
      '/recipe',
      '/recipe/settings?page=update',
      '/recipe/settings?page=create',
      '/tools/reports'
    ];

    if (dashboard.includes(routerName)) {
      this.headerStatus = true;
      this.sideNavDashboard = true;
      this.sideNaveSettings = false;
      this.sideNavAdmin = false;
    } else if (settings.includes(routerName)) {
      this.sideNaveSettings = true;
      this.sideNavDashboard = false;
      this.sideNavAdmin = false;
      this.headerStatus = true;
    } else if (admin.includes(routerName)) {
      this.headerStatus = true;
      this.sideNavDashboard = false;
      this.sideNaveSettings = false;
      this.sideNavAdmin = true;
    } else {
      this.headerStatus = false;
      this.sideNavDashboard = false;
      this.sideNaveSettings = false;
      this.sideNavAdmin = false;
    }
  }
  loaderScreen(event){
    this.parentLoader.emit(event);
  }
}
