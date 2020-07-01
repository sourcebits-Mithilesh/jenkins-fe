/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TechSupportService } from './tech-support.service';

describe('Service: TechSupport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechSupportService]
    });
  });

  it('should ...', inject(
    [TechSupportService],
    (service: TechSupportService) => {
      expect(service).toBeTruthy();
    }
  ));
});
