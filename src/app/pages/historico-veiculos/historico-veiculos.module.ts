import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoricoVeiculosPageRoutingModule } from './historico-veiculos-routing.module';

import { HistoricoVeiculosPage } from './historico-veiculos.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from 'src/app/pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoricoVeiculosPageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot() 
  ],
  declarations: [HistoricoVeiculosPage]
})
export class HistoricoVeiculosPageModule {}
