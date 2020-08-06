import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfiguracoesPage } from './configuracoes.page';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracoesPage
  },  {
    path: 'produtos',
    loadChildren: () => import('./produtos/produtos.module').then( m => m.ProdutosPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracoesPageRoutingModule {}
