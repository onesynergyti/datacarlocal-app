import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriasPageRoutingModule } from './categorias-routing.module';

import { CategoriasPage } from './categorias.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { CadastroCategoriaPage } from './cadastro-categoria/cadastro-categoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriasPageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot() 
  ],
  entryComponents: [CadastroCategoriaPage],
  declarations: [CategoriasPage, CadastroCategoriaPage]
})
export class CategoriasPageModule {}
