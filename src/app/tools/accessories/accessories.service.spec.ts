import { TestBed } from '@angular/core/testing';

import { AccessoriesService } from './accessories.service';

describe('AccessoriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccessoriesService = TestBed.get(AccessoriesService);
    expect(service).toBeTruthy();
  });
});
