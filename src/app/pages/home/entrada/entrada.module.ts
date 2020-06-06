import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntradaPageRoutingModule } from './entrada-routing.module';
import { EntradaPage } from './entrada.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SaidaPage } from '../saida/saida.page';
import { PipeModule } from 'src/app/pipes/pipe.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntradaPageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot()
  ],
  entryComponents: [SaidaPage],
  declarations: [EntradaPage, SaidaPage]
})
export class EntradaPageModule {}
