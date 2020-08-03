import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { HeaderModalComponent } from './header-modal/header-modal.component';
import { AvariaComponent } from './avaria/avaria.component';

@NgModule({
  imports: [
    CommonModule, 
    IonicModule
  ],
  declarations: [
    HeaderComponent,
    HeaderModalComponent,
    AvariaComponent
  ],
  exports: [
    HeaderComponent,
    HeaderModalComponent,
    AvariaComponent
  ]
})
export class ComponentsModule { }
