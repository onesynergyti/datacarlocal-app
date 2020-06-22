import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { EntradaPage } from './entrada/entrada.page';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { CadastroServicoPage } from './entrada/cadastro-servico/cadastro-servico.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot() 
  ],
  entryComponents: [EntradaPage, CadastroServicoPage],
  declarations: [HomePage, EntradaPage, CadastroServicoPage]
})
export class HomePageModule {}
