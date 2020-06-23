import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoricoVeiculosPage } from './historico-veiculos.page';

const routes: Routes = [
  {
    path: '',
    component: HistoricoVeiculosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricoVeiculosPageRoutingModule {}
