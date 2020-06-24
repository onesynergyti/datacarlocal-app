import { Pipe } from '@angular/core';

@Pipe({
  name: 'telefonePipe'
})
export class TelefonePipe {

  transform(value: string): string {
      
    if (value != null) {
      if (value.length >= 11)
        return '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7)
      else if (value.length >= 7)
        return '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6)
      else if (value.length >= 3)
        return '(' + value.substring(0, 2) + ') ' + value.substring(2)
      else
        return value
    }
    else
      return value
  }
}
