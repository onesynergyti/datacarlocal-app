import { NgModule } from '@angular/core';
import { DecimalPipe } from './decimal.pipe'

@NgModule({
    imports:        [],
    declarations:   [DecimalPipe],
    exports:        [DecimalPipe],
})

export class PipeModule {

  static forRoot() {
     return {
         ngModule: PipeModule,
         providers: [],
     };
  }
} 