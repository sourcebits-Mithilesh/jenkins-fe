import { TestBed } from '@angular/core/testing';

import { EventLogService } from './eventLog.service';

describe('EventLog2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventLogService = TestBed.get(EventLogService);
    expect(service).toBeTruthy();
  });
});
