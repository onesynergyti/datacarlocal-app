import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPopupModalPage } from './select-popup-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPopupModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPopupModalPageRoutingModule {}
