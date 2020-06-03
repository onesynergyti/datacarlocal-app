import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfiguracoesEstacionamentoPage } from './configuracoes-estacionamento.page';

describe('ConfiguracoesEstacionamentoPage', () => {
  let component: ConfiguracoesEstacionamentoPage;
  let fixture: ComponentFixture<ConfiguracoesEstacionamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracoesEstacionamentoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesEstacionamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
