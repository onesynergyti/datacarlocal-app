import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MensalistasPageRoutingModule } from './mensalistas-routing.module';
import { MensalistasPage } from './mensalistas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MensalistasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MensalistasPage]
})
export class MensalistasPageModule {}