import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendenciasPageRoutingModule } from './pendencias-routing.module';

import { PendenciasPage } from './pendencias.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from 'src/app/pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendenciasPageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot()
  ],
  declarations: [PendenciasPage]
})
export class PendenciasPageModule {}
