import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovimentoPageRoutingModule } from './movimento-routing.module';

import { MovimentoPage } from './movimento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovimentoPageRoutingModule
  ],
  declarations: [MovimentoPage]
})
export class MovimentoPageModule {}
