import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatSchedulerWeekViewComponent } from './heat-scheduler-week-view.component';

describe('HeatSchedulerWeekViewComponent', () => {
  let component: HeatSchedulerWeekViewComponent;
  let fixture: ComponentFixture<HeatSchedulerWeekViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatSchedulerWeekViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatSchedulerWeekViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
