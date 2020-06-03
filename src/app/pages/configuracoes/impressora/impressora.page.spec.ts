import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImpressoraPage } from './impressora.page';

describe('ImpressoraPage', () => {
  let component: ImpressoraPage;
  let fixture: ComponentFixture<ImpressoraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpressoraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImpressoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
