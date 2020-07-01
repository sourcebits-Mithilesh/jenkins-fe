import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatSchedulerHourComponent } from './heat-scheduler-hour.component';

describe('HeatSchedulerHourComponent', () => {
  let component: HeatSchedulerHourComponent;
  let fixture: ComponentFixture<HeatSchedulerHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatSchedulerHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatSchedulerHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
