import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidarAcessoPage } from './validar-acesso.page';

const routes: Routes = [
  {
    path: '',
    component: ValidarAcessoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidarAcessoPageRoutingModule {}
