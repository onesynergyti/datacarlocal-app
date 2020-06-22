import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FuncionariosPage } from './funcionarios.page';

describe('FuncionariosPage', () => {
  let component: FuncionariosPage;
  let fixture: ComponentFixture<FuncionariosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncionariosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
