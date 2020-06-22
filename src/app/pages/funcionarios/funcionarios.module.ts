import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FuncionariosPageRoutingModule } from './funcionarios-routing.module';

import { FuncionariosPage } from './funcionarios.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { CadastroFuncionarioPage } from './cadastro-funcionario/cadastro-funcionario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuncionariosPageRoutingModule,
    ComponentsModule
  ],
  entryComponents: [CadastroFuncionarioPage],
  declarations: [FuncionariosPage, CadastroFuncionarioPage]
})
export class FuncionariosPageModule {}
