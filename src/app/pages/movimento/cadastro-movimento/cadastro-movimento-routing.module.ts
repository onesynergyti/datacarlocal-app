import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroMovimentoPage } from './cadastro-movimento.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroMovimentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroMovimentoPageRoutingModule {}
