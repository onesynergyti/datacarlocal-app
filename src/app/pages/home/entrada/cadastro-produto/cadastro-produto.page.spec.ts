import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadastroProdutoPage } from './cadastro-produto.page';

describe('CadastroProdutoPage', () => {
  let component: CadastroProdutoPage;
  let fixture: ComponentFixture<CadastroProdutoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroProdutoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroProdutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
