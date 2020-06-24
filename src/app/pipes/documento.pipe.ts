import { Pipe } from '@angular/core';

@Pipe({
  name: 'documentoPipe'
})
export class DocumentoPipe {

  transform(value: string): string {
      
    if (value != null && value.length >= 14)
      return value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5, 8) + '/' + value.substring(8, 12) + '-' + value.substring(12)
    else if (value != null && value.length >= 11)
      return value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9) + '-' + value.substring(9)
    else
      return value
  }
}
