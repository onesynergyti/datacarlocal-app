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
  },
  {
    path: 'portal',
    loadChildren: () => import('./portal/portal.module').then( m => m.PortalPageModule)
  },
  {
    path: 'tabela-estacionamento',
    loadChildren: () => import('./tabela-estacionamento/tabela-estacionamento.module').then( m => m.TabelaEstacionamentoPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracoesPageRoutingModule {}
