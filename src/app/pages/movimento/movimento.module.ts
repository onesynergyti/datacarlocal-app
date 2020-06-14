import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovimentoPageRoutingModule } from './movimento-routing.module';

import { MovimentoPage } from './movimento.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { CadastroMovimentoPage } from './cadastro-movimento/cadastro-movimento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovimentoPageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot() 
  ],
  entryComponents: [CadastroMovimentoPage],
  declarations: [MovimentoPage, CadastroMovimentoPage]
})
export class MovimentoPageModule {}
