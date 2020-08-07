import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackupOnlinePage } from './backup-online.page';

const routes: Routes = [
  {
    path: '',
    component: BackupOnlinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackupOnlinePageRoutingModule {}
