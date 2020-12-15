import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SqlClientComponent } from './sql-client.component';

describe('SqlClientComponent', () => {
  let component: SqlClientComponent;
  let fixture: ComponentFixture<SqlClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlClientComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
