import { Pipe } from '@angular/core';
import {CurrencyPipe} from '@angular/common';


@Pipe({
  name: 'decimalPipe'
})
export class DecimalPipe extends CurrencyPipe {

  transform(value: any, simboloMonetario?: string, separadorDecimal?: string): any {
    let fracao = '1.2-5';
    // Separador nulo considera valor formato Brasil
    separadorDecimal = separadorDecimal == null ? ',' : separadorDecimal
    // Separador milhar é o inverso do separador decimal
    let separadorMilhar = separadorDecimal == '.' ? ',' : '.'
    
    // Substitui todos pelo separador de milhar identificado
    let numeroFormatado = super.transform(value, simboloMonetario, 'symbol', fracao).replace(',', separadorMilhar);
    
    // Se não passou símbolo monetário, elimina o símbolo padrão
    if (simboloMonetario == null) {
      numeroFormatado = numeroFormatado.replace('$', '')
    }
    
    // Define o separador decimal
    numeroFormatado = numeroFormatado.substr(0, numeroFormatado.length - 3) + separadorDecimal + numeroFormatado.substr(numeroFormatado.length - 2, 2)
    
    return numeroFormatado;
  }

}
