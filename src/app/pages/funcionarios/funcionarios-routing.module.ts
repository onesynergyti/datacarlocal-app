import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FuncionariosPage } from './funcionarios.page';

const routes: Routes = [
  {
    path: '',
    component: FuncionariosPage
  },
  {
    path: 'cadastro-funcionario',
    loadChildren: () => import('./cadastro-funcionario/cadastro-funcionario.module').then( m => m.CadastroFuncionarioPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuncionariosPageRoutingModule {}
