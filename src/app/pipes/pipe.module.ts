import { NgModule } from '@angular/core';
import { DecimalPipe } from './decimal.pipe'
import { DecimalInputPipe } from './decimalInput.pipe';
import { TelefonePipe } from './telefone.pipe';
import { DocumentoPipe } from './documento.pipe';
import { PlacaPipe } from './placa.pipe';

@NgModule({
    imports:        [],
    declarations:   [DecimalPipe, DecimalInputPipe, TelefonePipe, DocumentoPipe, PlacaPipe],
    exports:        [DecimalPipe, DecimalInputPipe, TelefonePipe, DocumentoPipe, PlacaPipe],
})

export class PipeModule {

  static forRoot() {
     return {
         ngModule: PipeModule,
         providers: [],
     };
  }
} 