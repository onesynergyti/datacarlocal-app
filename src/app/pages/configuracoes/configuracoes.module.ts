import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfiguracoesPageRoutingModule } from './configuracoes-routing.module';

import { ConfiguracoesPage } from './configuracoes.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from 'src/app/pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfiguracoesPageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot() 
  ],
  declarations: [ConfiguracoesPage]
})
export class ConfiguracoesPageModule {}
