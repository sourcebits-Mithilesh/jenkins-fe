/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EventLogFilesService } from './event-log-files.service';

describe('Service: EventLogFiles', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventLogFilesService]
    });
  });

  it('should ...', inject(
    [EventLogFilesService],
    (service: EventLogFilesService) => {
      expect(service).toBeTruthy();
    }
  ));
});
