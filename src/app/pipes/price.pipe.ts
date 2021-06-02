import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(value: number): any {
    if (!value) {
      return 0;
    }

    let texto = value.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    if (value % 1 == 0) {
      texto = texto.slice(0, texto.length - 2 );
    }

    texto += ' Gs';
    return texto;

  }


}
