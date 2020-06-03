import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImpressoraPageRoutingModule } from './impressora-routing.module';

import { ImpressoraPage } from './impressora.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImpressoraPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ImpressoraPage]
})
export class ImpressoraPageModule {}
