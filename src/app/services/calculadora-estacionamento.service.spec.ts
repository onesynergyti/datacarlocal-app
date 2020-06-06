import { TestBed } from '@angular/core/testing';

import { CalculadoraEstacionamentoService } from './calculadora-estacionamento.service';

describe('CalculadoraEstacionamentoService', () => {
  let service: CalculadoraEstacionamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculadoraEstacionamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
