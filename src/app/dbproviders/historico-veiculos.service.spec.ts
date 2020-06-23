import { TestBed } from '@angular/core/testing';

import { HistoricoVeiculosService } from './historico-veiculos.service';

describe('HistoricoVeiculosService', () => {
  let service: HistoricoVeiculosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricoVeiculosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
