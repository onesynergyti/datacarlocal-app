import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroPlanoPage } from './cadastro-plano.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroPlanoPage
  },
  {
    path: 'cadastro-placa',
    loadChildren: () => import('./cadastro-placa/cadastro-placa.module').then( m => m.CadastroPlacaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroPlanoPageRoutingModule {}
