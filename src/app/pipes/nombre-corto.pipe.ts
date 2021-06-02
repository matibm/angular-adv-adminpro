import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreCorto'
})
export class NombreCortoPipe implements PipeTransform {

  transform(nombreCompleto: String, ...args: unknown[]): unknown {
    let nombre = nombreCompleto[0];
    let apellido = nombreCompleto[1];
    nombre = nombre.split(' ')[0];
    apellido = apellido.split(' ')[0];

    return `${nombre} ${apellido}`;
  }

}
