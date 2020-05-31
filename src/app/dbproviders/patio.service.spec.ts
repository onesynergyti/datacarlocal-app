import { TestBed } from '@angular/core/testing';

import { PatioService } from './patio.service';

describe('PatioService', () => {
  let service: PatioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
