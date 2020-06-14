import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovimentoPage } from './movimento.page';

const routes: Routes = [
  {
    path: '',
    component: MovimentoPage
  },
  {
    path: 'cadastro-movimento',
    loadChildren: () => import('./cadastro-movimento/cadastro-movimento.module').then( m => m.CadastroMovimentoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovimentoPageRoutingModule {}
