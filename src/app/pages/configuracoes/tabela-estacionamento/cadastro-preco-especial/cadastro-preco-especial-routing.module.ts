import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroPrecoEspecialPage } from './cadastro-preco-especial.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroPrecoEspecialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroPrecoEspecialPageRoutingModule {}
