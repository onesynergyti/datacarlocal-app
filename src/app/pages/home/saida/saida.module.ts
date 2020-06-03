import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SaidaPageRoutingModule } from './saida-routing.module';
import { SaidaPage } from './saida.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SaidaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SaidaPage]
})
export class SaidaPageModule {}
