import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssinaturaPage } from './assinatura.page';

describe('AssinaturaPage', () => {
  let component: AssinaturaPage;
  let fixture: ComponentFixture<AssinaturaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssinaturaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssinaturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
