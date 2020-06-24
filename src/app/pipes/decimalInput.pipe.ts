import { Pipe } from '@angular/core';

@Pipe({
  name: 'decimalInputPipe'
})
export class DecimalInputPipe {

  transform(value: any, separadorDecimal?: string): any {
      
    // Separador nulo considera valor formato Brasil
    separadorDecimal = separadorDecimal == null ? ',' : separadorDecimal

    // Transforma o número
    const numeroFormatado = (Number(value.toString().replace(/\D/g, ""))).toFixed(2);
    return Number(value != null ? value : 0).toFixed(2)
  }

}
