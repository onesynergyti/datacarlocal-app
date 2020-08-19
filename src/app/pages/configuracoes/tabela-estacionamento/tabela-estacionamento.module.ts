import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabelaEstacionamentoPageRoutingModule } from './tabela-estacionamento-routing.module';

import { TabelaEstacionamentoPage } from './tabela-estacionamento.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { CadastroPrecoEspecialPage } from './cadastro-preco-especial/cadastro-preco-especial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabelaEstacionamentoPageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot() 
  ],
  entryComponents: [CadastroPrecoEspecialPage],
  declarations: [CadastroPrecoEspecialPage, TabelaEstacionamentoPage]
})
export class TabelaEstacionamentoPageModule {}
