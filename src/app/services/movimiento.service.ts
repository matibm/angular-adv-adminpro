import { CajaService } from './caja.service';
import { URL_SERVICIOS } from './../config/global';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { Interface } from 'readline';
import { Movimiento } from '../models/movimiento';

@Injectable({
  providedIn: 'root',
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
    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        console.log(resp);

        return resp.tipos_movimiento;
      });
  }

  getUltimaCuenta(proveedorId) {
    let url = `${URL_SERVICIOS}/movimientos/get_ultima_cuenta`;
    url += `?token=${this._usuarioService.token}`;
    url += `&proveedor=${proveedorId}`;

    return this.http.get(url).toPromise();
  }
  getSaldoFondo(fondo_id) {
    let url = `${URL_SERVICIOS}/movimientos/get_saldo_de_fondo`;
    url += `?token=${this._usuarioService.token}`;
    url += `&id_fondo=${fondo_id}`;

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
  getMovimientoById(id?) {
    let url = `${URL_SERVICIOS}/movimientos/by_id`;
    url += `?token=${this._usuarioService.token}`;
    id ? (url += `&id=${id}`) : null;
    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        return resp.movimiento;
      });
  }
  eliminarGasto(id?) {
    let url = `${URL_SERVICIOS}/movimientos/delete_gasto`;
    url += `?token=${this._usuarioService.token}`;
    id ? (url += `&id=${id}`) : null;
    return this.http
      .delete(url)
      .toPromise()
      .then((resp: any) => {
        swal.fire(resp.message, '', 'success')
        return {}
      }, (err) => {
        swal.fire('Error', err.error.message, 'error')
      });
  }
  getCuentasAbaco(tipoCuenta?) {
    let url = `${URL_SERVICIOS}/movimientos/get_cuentas_abaco`;
    url += `?token=${this._usuarioService.token}`;
    if (tipoCuenta) url += `&tipo_cuenta=${tipoCuenta}`
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
  searchCategorias(search) {
    let url = `${URL_SERVICIOS}/movimientos/search_categorias`;
    url += `?token=${this._usuarioService.token}`;
    url += `&search=${search}`;
    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        return resp.categorias;
      });
  }

  getCategoriaById(id) {
    let url = `${URL_SERVICIOS}/movimientos/categoria_by_id`;
    url += `?token=${this._usuarioService.token}`;
    url += `&id=${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        console.log(resp);

        return resp.categoria;
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
        swal.fire('Cuenta creada', '', 'success')

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
        swal.fire('Cuenta creada', '', 'success')
        return resp.cuenta;
      });
  }
  crearCategoriaGasto(categoria) {
    let url = `${URL_SERVICIOS}/movimientos/crear_categoria`;
    url += `?token=${this._usuarioService.token}`;
    return this.http
      .post(url, categoria)
      .toPromise()
      .then((resp: any) => {
        console.log(resp);
        swal.fire('Categoria creada', '', 'success')

        return resp.cuenta;
      });
  }
  getAllMovimientos(options?): Promise<getAllMovimientos> {
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

  getCuentaGastoById(id: string, ctapadre?) {
    if (!id) throw new Error('necesitamos el id')
    let url = `${URL_SERVICIOS}/movimientos/get_cuenta_gasto_by_id`;
    url += `?token=${this._usuarioService.token}`;
    url += `&id=${id}`
    url += `&id=${id}`
    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        return resp.cuentaGasto;
      });
  }
  getCuentaGastoByCtaPadre(ctapadre) {
    let url = `${URL_SERVICIOS}/movimientos/get_cuenta_gasto_by_ctapadre`;
    url += `?token=${this._usuarioService.token}`;
    url += `&ctapadre=${ctapadre}`
    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        return resp.cuentaGasto;
      });
  }

  updateCuentas(body) {
    let url = `${URL_SERVICIOS}/movimientos/guardar_cambios`;
    url += `?token=${this._usuarioService.token}`;

    return this.http
      .post(url, body)
      .toPromise()
      .then((resp: any) => {
        console.log(resp);
        swal.fire('Cambios Guardados', '', 'success')
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
    // const caja = await this._cajaService.getCajaActual();
    let url = `${URL_SERVICIOS}/movimientos/crear_movimiento`;
    url += `?token=${this._usuarioService.token}`;
    // url += `&caja=${caja._id}`;

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
  getCajaBancos(page?, options?) {
    let url = `${URL_SERVICIOS}/movimientos/get_caja_bancos`;
    url += `?token=${this._usuarioService.token}`;
    page ? (url += `&page=${page}`) : '';
    return this.http
      .post(url, options)
      .toPromise()
      .then((resp: any) => {
        console.log(resp);

        return resp;
      });
  }
  getReporteGastoIngresoPsm() {
    let url = `${URL_SERVICIOS}/reporte/gasto_ingreso_psm`;
    url += `?token=${this._usuarioService.token}`;

    return this.http
      .get(url)
      .toPromise()
      .then((resp: any) => {
        console.log(resp);

        return resp;
      });
  }

  getReporteIngresoEgreso(body) {
    let url = `${URL_SERVICIOS}/movimientos/get_caja_bancos/excel`;
    url += `?token=${this._usuarioService.token}`;
    
    this.http.post(url, body, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));

        downloadLink.setAttribute('download', 'reporte_ingreso_egreso .xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove()
      }
    )
  }
  getReporteEgresoResumido(body) {
    let url = `${URL_SERVICIOS}/movimientos/reporte_resumen_excel`;
    url += `?token=${this._usuarioService.token}`;
    
    this.http.post(url, body, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));

        downloadLink.setAttribute('download', 'reporte_egreso_resumido.xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove()
      }
    )
  }
  getGastoExcel(body) {
    let url = `${URL_SERVICIOS}/movimientos/gastos_excel`;
    url += `?token=${this._usuarioService.token}`;
    
    this.http.post(url, body, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));

        downloadLink.setAttribute('download', 'gastos.xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove()
      }
    )
  }
}

interface getAllMovimientos {
  ok: boolean,
  movimientos: Movimiento[],
  total: any,
  count: number
}
