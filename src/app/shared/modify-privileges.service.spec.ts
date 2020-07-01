import { TestBed } from '@angular/core/testing';

import { ModifyPrivilegesService } from './modify-privileges.service';

describe('ModifyPrivilegesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModifyPrivilegesService = TestBed.get(
      ModifyPrivilegesService
    );
    expect(service).toBeTruthy();
  });
});
