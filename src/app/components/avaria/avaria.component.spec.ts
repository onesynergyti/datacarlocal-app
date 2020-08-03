import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvariaComponent } from './avaria.component';

describe('AvariaComponent', () => {
  let component: AvariaComponent;
  let fixture: ComponentFixture<AvariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvariaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
