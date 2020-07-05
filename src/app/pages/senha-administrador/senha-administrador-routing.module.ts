import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SenhaAdministradorPage } from './senha-administrador.page';

const routes: Routes = [
  {
    path: '',
    component: SenhaAdministradorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SenhaAdministradorPageRoutingModule {}
