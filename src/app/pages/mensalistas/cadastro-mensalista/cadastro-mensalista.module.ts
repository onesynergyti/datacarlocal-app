import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroMensalistaPageRoutingModule } from './cadastro-mensalista-routing.module';

import { CadastroMensalistaPage } from './cadastro-mensalista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroMensalistaPageRoutingModule
  ],
  declarations: [CadastroMensalistaPage]
})
export class CadastroMensalistaPageModule {}
