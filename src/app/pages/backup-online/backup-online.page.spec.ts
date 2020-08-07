import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BackupOnlinePage } from './backup-online.page';

describe('BackupOnlinePage', () => {
  let component: BackupOnlinePage;
  let fixture: ComponentFixture<BackupOnlinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupOnlinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BackupOnlinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
