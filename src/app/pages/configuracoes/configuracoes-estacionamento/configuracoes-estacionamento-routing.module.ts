import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfiguracoesEstacionamentoPage } from './configuracoes-estacionamento.page';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracoesEstacionamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracoesEstacionamentoPageRoutingModule {}
