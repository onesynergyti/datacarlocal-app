import { Pipe } from '@angular/core';

@Pipe({
  name: 'placaPipe'
})
export class PlacaPipe {

  transform(value: string): string {
    if (value != null) {
      if (value.length >= 4)
        return value.substring(0, 3) + '-' + value.substring(3)
      else
        return value
    }
    else
      return value
}

}
