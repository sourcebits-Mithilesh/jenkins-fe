import { TestBed } from '@angular/core/testing';

import { SuperAdminDhasboardService } from './super-admin-dhasboard.service';

describe('AdminDhasboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuperAdminDhasboardService = TestBed.get(
      SuperAdminDhasboardService
    );
    expect(service).toBeTruthy();
  });
});
