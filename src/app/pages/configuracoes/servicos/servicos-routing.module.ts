import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicosPage } from './servicos.page';

const routes: Routes = [
  {
    path: '',
    component: ServicosPage
  },
  {
    path: 'cadastro-servico',
    loadChildren: () => import('./cadastro-servico/cadastro-servico.module').then( m => m.CadastroServicoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicosPageRoutingModule {}
