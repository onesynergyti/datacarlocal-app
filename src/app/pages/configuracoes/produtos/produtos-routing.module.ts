import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProdutosPage } from './produtos.page';

const routes: Routes = [
  {
    path: '',
    component: ProdutosPage
  },
  {
    path: 'cadastro-produto',
    loadChildren: () => import('./cadastro-produto/cadastro-produto.module').then( m => m.CadastroProdutoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdutosPageRoutingModule {}
