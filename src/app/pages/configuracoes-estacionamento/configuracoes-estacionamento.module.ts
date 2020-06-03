import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfiguracoesEstacionamentoPageRoutingModule } from './configuracoes-estacionamento-routing.module';

import { ConfiguracoesEstacionamentoPage } from './configuracoes-estacionamento.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfiguracoesEstacionamentoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ConfiguracoesEstacionamentoPage]
})
export class ConfiguracoesEstacionamentoPageModule {}
