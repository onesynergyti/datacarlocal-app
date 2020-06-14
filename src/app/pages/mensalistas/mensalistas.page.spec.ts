import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MensalistasPage } from './mensalistas.page';

describe('MensalistasPage', () => {
  let component: MensalistasPage;
  let fixture: ComponentFixture<MensalistasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensalistasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MensalistasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
