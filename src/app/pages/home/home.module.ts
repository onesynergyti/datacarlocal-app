import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { EntradaPage } from './entrada/entrada.page';
import { SaidaPage } from './saida/saida.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule    
  ],
  entryComponents: [EntradaPage],
  declarations: [HomePage, EntradaPage]
})
export class HomePageModule {}
