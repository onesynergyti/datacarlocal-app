import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ValidarAcessoPage } from './validar-acesso.page';

describe('ValidarAcessoPage', () => {
  let component: ValidarAcessoPage;
  let fixture: ComponentFixture<ValidarAcessoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidarAcessoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidarAcessoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
