import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabelaEstacionamentoPage } from './tabela-estacionamento.page';

describe('TabelaEstacionamentoPage', () => {
  let component: TabelaEstacionamentoPage;
  let fixture: ComponentFixture<TabelaEstacionamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabelaEstacionamentoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabelaEstacionamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
