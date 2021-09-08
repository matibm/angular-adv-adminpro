import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleBreadcrumb'
})
export class TitleBreadcrumbPipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {
    let data = value;
    value == 'info_contrato' ? data = 'Información de Contrato' : null;
    value == 'crear_contrato' ? data = 'Crear Contrato' : null;
    value == 'lista_contratos' ? data = 'Lista de Contratos' : null;
    value.indexOf('info_caja') !=-1 ? data = 'Caja/Bancos' : null;
    value == 'usuarios' ? data = 'Lista de usuarios' : null;

    return data;
  }

}
