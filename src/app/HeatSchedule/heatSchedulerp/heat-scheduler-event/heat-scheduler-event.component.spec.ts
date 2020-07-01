import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatSchedulerEventComponent } from './heat-scheduler-event.component';

describe('HeatSchedulerEventComponent', () => {
  let component: HeatSchedulerEventComponent;
  let fixture: ComponentFixture<HeatSchedulerEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatSchedulerEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatSchedulerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
