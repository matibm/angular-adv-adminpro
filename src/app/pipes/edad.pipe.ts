import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'edad'
})
export class EdadPipe implements PipeTransform {

  transform(date: any, ...args: unknown[]): any {
    if (!date) {
      return null;
    }
    const hoy = new Date();
    const fechaNacimiento = new Date(date);
    fechaNacimiento.setHours(5);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
    if (
      diferenciaMeses < 0 ||
      (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      edad--;
    }

    return edad;

  }

}
