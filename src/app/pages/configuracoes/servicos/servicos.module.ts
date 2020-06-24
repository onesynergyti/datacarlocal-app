import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicosPageRoutingModule } from './servicos-routing.module';

import { ServicosPage } from './servicos.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { CadastroServicoPage } from './cadastro-servico/cadastro-servico.page';
import { PipeModule } from 'src/app/pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicosPageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot() 

  ],
  entryComponents:[CadastroServicoPage],
  declarations: [ServicosPage, CadastroServicoPage]
})
export class ServicosPageModule {}
