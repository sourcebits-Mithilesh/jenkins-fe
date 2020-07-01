import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatschedulerComponent } from './heatscheduler.component';

describe('HeatschedulerComponent', () => {
  let component: HeatschedulerComponent;
  let fixture: ComponentFixture<HeatschedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatschedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatschedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
