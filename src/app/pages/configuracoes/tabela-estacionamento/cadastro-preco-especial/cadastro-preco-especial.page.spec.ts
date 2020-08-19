import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadastroPrecoEspecialPage } from './cadastro-preco-especial.page';

describe('CadastroPrecoEspecialPage', () => {
  let component: CadastroPrecoEspecialPage;
  let fixture: ComponentFixture<CadastroPrecoEspecialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroPrecoEspecialPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroPrecoEspecialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
