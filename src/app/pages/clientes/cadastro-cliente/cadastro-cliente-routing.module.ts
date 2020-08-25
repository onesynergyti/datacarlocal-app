import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroClientePage } from './cadastro-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroClientePage
  },
  {
    path: 'cadastro-plano',
    loadChildren: () => import('./cadastro-plano/cadastro-plano.module').then( m => m.CadastroPlanoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroClientePageRoutingModule {}
