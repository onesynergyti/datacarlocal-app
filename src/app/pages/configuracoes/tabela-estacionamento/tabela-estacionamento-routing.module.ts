import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabelaEstacionamentoPage } from './tabela-estacionamento.page';

const routes: Routes = [
  {
    path: '',
    component: TabelaEstacionamentoPage
  },
  {
    path: 'cadastro-preco-especial',
    loadChildren: () => import('./cadastro-preco-especial/cadastro-preco-especial.module').then( m => m.CadastroPrecoEspecialPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabelaEstacionamentoPageRoutingModule {}
