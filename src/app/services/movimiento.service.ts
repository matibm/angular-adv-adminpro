import { CajaService } from './caja.service';
import { URL_SERVICIOS } from './../config/global';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService,
    public _cajaService: CajaService

  ) { }
  getTipoMovimiento(nivel?, padre?) {
    console.log('nivel', nivel);
    console.log('padre:', padre);

    let url = `${URL_SERVICIOS}/movimientos/tipos/all`;
    url += `?token=${this._usuarioService.token}`;
    url += `&nivel=${nivel}`;
    if (padre) {
      url += `&padre=${padre}`;

    }
    return this.http.get(url).toPromise().then((resp: any) => {

      return resp.tipos_movimiento;
    });
  }
  getMovimientos(tipo_id?) {

    let url = `${URL_SERVICIOS}/movimientos/by_type`;
    url += `?token=${this._usuarioService.token}`;
    tipo_id ? url += `&tipo_id=${tipo_id}` : null;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.movimientos;
    });
  }
  getAllMovimientos(options?) {

    let url = `${URL_SERVICIOS}/movimientos/all`;
    url += `?token=${this._usuarioService.token}`;
    if (options) {
      console.log(options);

      Object.entries(options).forEach(([key, value]) => {

          url += `&${key}=${value}`;

      });
    }
    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp;
    });
  }
  // getMovimientosByDate(date_start?, date_end?, fondo?, cerrado?: boolean) {

  //   let url = `${URL_SERVICIOS}/movimientos/by_date`;
  //   url += `?token=${this._usuarioService.token}`
  //   date_end ? url += `&date_end=${date_end}` : null;
  //   date_start ? url += `&date_start=${date_start}` : null;
  //   fondo ? url += `&fondo=${fondo}` : null;
  //   url += `&cerrado=${cerrado}`


  //   return this.http.get(url).toPromise().then((resp: any) => {
  //     console.log("movimientos", resp);

  //     return resp
  //   })
  // }
  buscarTipoMovimientos(query, nivel) {
    console.log(query);
    console.log(nivel);

    let url = `${URL_SERVICIOS}/movimientos/search`;
    url += `?token=${this._usuarioService.token}`;
    url += `&query=${query}`;
    url += `&nivel=${nivel}`;
    console.log(url);

    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp.tipo_movimientos;
    });
  }

  async crearMovimiento(movimiento) {
    const caja = await this._cajaService.getCajaActual();
    let url = `${URL_SERVICIOS}/movimientos/crear_movimiento`;
    url += `?token=${this._usuarioService.token}`;
    url += `&caja=${caja._id}`;

    return this.http.post(url, movimiento).toPromise().then((resp: any) => {
      console.log(resp);

      swal.fire({
        icon: 'success',
        title: 'Movimiento creado',
        // text: 'I will close in 2 seconds.',
        timer: 2000,
      });
      return resp.movimiento;
    }, (error) => {
      swal.fire({
        icon: 'error',
        title: 'Error al crear Movimiento',
        text: error

      });
      return error;
    });
  }

}
