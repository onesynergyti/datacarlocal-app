import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackupOnlinePageRoutingModule } from './backup-online-routing.module';

import { BackupOnlinePage } from './backup-online.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackupOnlinePageRoutingModule
  ],
  declarations: [BackupOnlinePage]
})
export class BackupOnlinePageModule {}
