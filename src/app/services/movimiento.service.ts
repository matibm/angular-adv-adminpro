import { CajaService } from './caja.service';
import { URL_SERVICIOS } from './../config/global';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MovimientoService {
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService,
    public _cajaService: CajaService
  ) {}
  getTipoMovimiento(nivel?, padre?) {
    console.log('nivel', nivel);
    console.log('padre:', padre);

    let url = `${URL_SERVICIOS}/movimientos/tipos/all`;
    url += `?token=${this._usuarioService.token}`;
    url += `&nivel=${nivel}`;
    if (padre) {
      url += `&padre=${padre}`;
    }
    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        return resp.tipos_movimiento;
      });
  }

  getUltimaCuenta(proveedorId) {
    let url = `${URL_SERVICIOS}/movimientos/get_ultima_cuenta`;
    url += `?token=${this._usuarioService.token}`;
    url += `&proveedor=${proveedorId}`;

    return this.http.get(url).toPromise();
  }

  getMovimientos(tipo_id?) {
    let url = `${URL_SERVICIOS}/movimientos/by_type`;
    url += `?token=${this._usuarioService.token}`;
    tipo_id ? (url += `&tipo_id=${tipo_id}`) : null;
    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        return resp.movimientos;
      });
  }
  getCuentasAbaco(tipoCuenta) {
    let url = `${URL_SERVICIOS}/movimientos/get_cuentas_abaco`;
    url += `?token=${this._usuarioService.token}`;
    url += `&tipo_cuenta=${tipoCuenta}`;
    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        return resp.cuentas;
      });
  }
  searchCuentasAbaco(search) {
    let url = `${URL_SERVICIOS}/movimientos/search_cuentas_abaco`;
    url += `?token=${this._usuarioService.token}`;
    url += `&search=${search}`;
    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        return resp.cuentas;
      });
  }
  crearCuentaGasto(cuenta) {
    let url = `${URL_SERVICIOS}/movimientos/crer_cuenta_gasto`;
    url += `?token=${this._usuarioService.token}`;
    return this.http
      .post(url, cuenta)
      .toPromise()
      .then((resp: any) => {
        console.log(resp);

        return resp.cuenta;
      });
  }
  crearCuentaAbaco(cuenta) {
    let url = `${URL_SERVICIOS}/movimientos/crer_cuenta_abaco`;
    url += `?token=${this._usuarioService.token}`;
    return this.http
      .post(url, cuenta)
      .toPromise()
      .then((resp: any) => {
        console.log(resp);

        return resp.cuenta;
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
    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
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

    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        console.log(resp);

        return resp.tipo_movimientos;
      });
  }
  eliminarCuentaGasto(id, confirmado?) {
    let url = `${URL_SERVICIOS}/movimientos/delete_cuenta_gasto`;
    url += `?token=${this._usuarioService.token}`;
    url += `&id=${id}`;
    url += `&confirmado=${confirmado || false}`;

    return this.http
      .delete(url)
      .toPromise()
      .then((resp: any) => {
        console.log(resp);

        if (!resp.deleted) {
          swal
            .fire({
              icon: 'warning',
              title: 'Eliminar Cuenta Gasto',
              text: resp.message,
              showCancelButton: true,
              cancelButtonText: 'cancelar',
              cancelButtonColor: '#ef5350',
              confirmButtonText: 'confirmar',
              confirmButtonColor: '#06d79c',
              showConfirmButton: true,
            })
            .then((res) => {
              if (res.isConfirmed == true) {
                this.eliminarCuentaGasto(id, true);
              } else {
              }
            });
        } else {
          swal.fire({
            icon: 'success',
            title: 'Cuenta Gasto Eliminada',
            text: resp.message,
            timer: 3000,
          });
        }

        return resp.tipo_movimientos;
      });
  }

  async crearMovimiento(movimiento) {
    const caja = await this._cajaService.getCajaActual();
    let url = `${URL_SERVICIOS}/movimientos/crear_movimiento`;
    url += `?token=${this._usuarioService.token}`;
    url += `&caja=${caja._id}`;

    return this.http
      .post(url, movimiento)
      .toPromise()
      .then(
        (resp: any) => {
          console.log(resp);

          swal.fire({
            icon: 'success',
            title: 'Movimiento creado',
            // text: 'I will close in 2 seconds.',
            timer: 2000,
          });
          return resp.movimiento;
        },
        (error) => {
          swal.fire({
            icon: 'error',
            title: 'Error al crear Movimiento',
            text: error,
          });
          return error;
        }
      );
  }

  allmovimientosCaja(fondo?) {
    let url = `${URL_SERVICIOS}/movimientos/get_all_caja`;
    url += `?token=${this._usuarioService.token}`;
    fondo ? (url += `&fondo=${fondo}`) : '';
    return this.http
      .post(url, {})
      .toPromise()
      .then((resp: any) => {
        console.log(resp);

        return resp.movimientos;
      });
  }
}
