import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesPageRoutingModule } from './clientes-routing.module';

import { ClientesPage } from './clientes.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { CadastroClientePage } from './cadastro-cliente/cadastro-cliente.page';
import { CadastroPlanoPage } from './cadastro-cliente/cadastro-plano/cadastro-plano.page';
import { CadastroPlacaPage } from './cadastro-cliente/cadastro-plano/cadastro-placa/cadastro-placa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesPageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot() 
  ],
  entryComponents: [CadastroClientePage, CadastroPlanoPage, CadastroPlacaPage],
  declarations: [ClientesPage, CadastroClientePage, CadastroPlanoPage, CadastroPlacaPage]
})
export class ClientesPageModule {}
