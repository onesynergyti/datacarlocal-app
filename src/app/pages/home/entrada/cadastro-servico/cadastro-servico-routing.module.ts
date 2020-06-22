import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroServicoPage } from './cadastro-servico.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroServicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroServicoPageRoutingModule {}
