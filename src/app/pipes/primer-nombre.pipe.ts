import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'primerNombre'
})
export class PrimerNombrePipe implements PipeTransform {

  transform(nombreCompleto: String, ...args: unknown[]): unknown {
    let nombre = nombreCompleto;

    nombre = nombre.split(' ')[0];


    return nombre;
  }
}
