import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntradaPage } from './entrada.page';

const routes: Routes = [
  {
    path: '',
    component: EntradaPage
  },
  {
    path: 'cadastro-servico',
    loadChildren: () => import('./cadastro-servico/cadastro-servico.module').then( m => m.CadastroServicoPageModule)
  },  {
    path: 'cadastro-produto',
    loadChildren: () => import('./cadastro-produto/cadastro-produto.module').then( m => m.CadastroProdutoPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntradaPageRoutingModule {}
