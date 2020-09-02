import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroCategoriaPage } from './cadastro-categoria.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroCategoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroCategoriaPageRoutingModule {}
