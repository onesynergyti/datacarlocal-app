import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImpressoraPage } from './impressora.page';

const routes: Routes = [
  {
    path: '',
    component: ImpressoraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpressoraPageRoutingModule {}
