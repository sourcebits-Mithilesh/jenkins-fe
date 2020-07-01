import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatSchedulerDayColumnComponent } from './heat-scheduler-day-column.component';

describe('HeatSchedulerDayColumnComponent', () => {
  let component: HeatSchedulerDayColumnComponent;
  let fixture: ComponentFixture<HeatSchedulerDayColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatSchedulerDayColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatSchedulerDayColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
