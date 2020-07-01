import { TestBed } from '@angular/core/testing';

import { AdminDhasboardService } from './admin-dhasboard.service';

describe('AdminDhasboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminDhasboardService = TestBed.get(AdminDhasboardService);
    expect(service).toBeTruthy();
  });
});
