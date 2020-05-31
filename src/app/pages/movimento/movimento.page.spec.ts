import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MovimentoPage } from './movimento.page';

describe('MovimentoPage', () => {
  let component: MovimentoPage;
  let fixture: ComponentFixture<MovimentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovimentoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MovimentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
