import { TestBed } from '@angular/core/testing';

import { MensalistasService } from './mensalistas.service';

describe('MensalistasService', () => {
  let service: MensalistasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensalistasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
