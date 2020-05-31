import { TestBed } from '@angular/core/testing';

import { ServiceBaseService } from './service-base.service';

describe('ServiceBaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceBaseService = TestBed.get(ServiceBaseService);
    expect(service).toBeTruthy();
  });
});
