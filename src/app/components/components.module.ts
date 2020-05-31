import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { HeaderModalComponent } from './header-modal/header-modal.component';

@NgModule({
  imports: [
    CommonModule, 
    IonicModule
  ],
  declarations: [
    HeaderComponent,
    HeaderModalComponent
  ],
  exports: [
    HeaderComponent,
    HeaderModalComponent
  ]
})
export class ComponentsModule { }
