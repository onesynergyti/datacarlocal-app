import { TestBed } from '@angular/core/testing';

import { PropagandasService } from './propagandas.service';

describe('PropagandasService', () => {
  let service: PropagandasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropagandasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
