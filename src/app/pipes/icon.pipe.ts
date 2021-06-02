import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'icon'
})
export class IconPipe implements PipeTransform {

  transform(tipo: unknown, ...args: unknown[]): unknown {
    let resp = '';
    tipo == 'CONTRATO' ? resp = '../assets/images/contrato.svg' : '';
    tipo == 'FACTURA' ? resp = '../assets/images/factura.svg' : '';
    tipo == 'PAGO' ? resp = '../assets/images/pago.svg' : '';
    return resp;
  }

}
