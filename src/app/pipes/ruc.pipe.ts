import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ruc'
})
export class RucPipe implements PipeTransform {

  constructor(private cp: CurrencyPipe) {

  }
  transform(value: string): any {
    if (!value) {
      return '';
    }

    let guion = '';
    let number: number;
    let conpuntos;
    if (value.includes('-')) {
      guion += value.slice(value.indexOf('-'));
      console.log(guion);

      number = parseInt(value.slice(0, value.indexOf('-') ));
    } else {
      number = parseInt(value);
    }
    conpuntos = this.cp.transform(number, '', '', '2.0');

    // if (value % 1 == 0) {
    //   texto = texto.slice(0, texto.length -2 )
    // }
    const texto = conpuntos + guion;

    return conpuntos ? texto : '';

  }

}
