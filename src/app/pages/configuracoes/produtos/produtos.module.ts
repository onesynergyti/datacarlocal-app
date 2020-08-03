import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdutosPageRoutingModule } from './produtos-routing.module';

import { ProdutosPage } from './produtos.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { CadastroProdutoPage } from './cadastro-produto/cadastro-produto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutosPageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot() 
  ],
  entryComponents: [CadastroProdutoPage],
  declarations: [ProdutosPage, CadastroProdutoPage]
})
export class ProdutosPageModule {}
