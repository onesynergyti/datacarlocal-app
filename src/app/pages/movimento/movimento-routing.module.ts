import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovimentoPage } from './movimento.page';

const routes: Routes = [
  {
    path: '',
    component: MovimentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovimentoPageRoutingModule {}
