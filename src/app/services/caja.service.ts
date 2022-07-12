import { URL_SERVICIOS } from './../config/global';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { isNull } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {
    this.getCajaActual();
  }

  cajaActual;

  cerrarCaja(start, end, fondo?) {

    let url = URL_SERVICIOS + '/caja/cerrar_caja';
    url += `?token=${this._usuarioService.token}`;
    url += `&caja=${this.cajaActual._id}`;
    url += `&start=${start ? start : 0}`;
    url += `&end=${end ? end : 0}`;
    fondo ? url += `&fondo=${fondo}` : null;

    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      swal.fire({
        icon: 'success',
        title: 'Caja cerrada',
        // text: 'I will close in 2 seconds.',
        timer: 2000,
      });
      return resp;
    });
  }
  cerrarCajaOptions(body, options?) {
    console.log(options);
    
    let url = URL_SERVICIOS + '/caja/cerrar_caja';
    url += `?token=${this._usuarioService.token}`;


    if (options) {
      Object.entries(options).forEach(([key, value]) => {

          url += `&${key}=${value}`;

      });
    }
    url += `&caja=caja_id_que_no_se_usa`;
    console.log(url);
    
    return this.http.put(url, body).toPromise().then((resp: any) => {
      console.log(resp);

      swal.fire({
        icon: 'success',
        title: 'Caja cerrada',
        // text: 'I will close in 2 seconds.',
        timer: 2000,
      });
      return resp;
    });
  }

  getCajaActual() {
    let url = URL_SERVICIOS + '/caja/caja_actual';
    url += `?token=${this._usuarioService.token}`;

    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);
      this.cajaActual = resp.caja;
      return resp.caja;
    });
  }
  getCierresDeCaja() {
    let url = URL_SERVICIOS + '/caja/lista_cierres';
    url += `?token=${this._usuarioService.token}`;

    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp.cierres;
    });
  }

}
