import { CajaService } from './caja.service';
import { URL_SERVICIOS } from './../config/global';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService,
    public _cajaService: CajaService
  ) { }

  crearFactura(factura) {

    let url = URL_SERVICIOS + '/factura/crear_factura';
    url += `?token=${this._usuarioService.token}`;

    return this.http.post(url, factura).toPromise().then((resp: any) => {
      console.log(resp);
      swal.fire({
        icon: 'success',
        title: 'Ingreso creado',
        // text: 'I will close in 2 seconds.',
        timer: 3000,
      });
      return resp.factura;
    });
  }
  aplicarInteres(options, interes) {

    let url = URL_SERVICIOS + '/factura/aplicar_interes';
    url += `?token=${this._usuarioService.token}`;
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value) {
          url += `&${key}=${value}`;
        } else if (value == false) {
          url += `&${key}=${value}`;
        }
      });
    }
    url += `&interes=${interes}`;

    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);
      swal.fire({
        icon: 'success',
        title: 'Interes aplicado',
        // text: 'I will close in 2 seconds.',
        timer: 3000,
      });
      return resp.factura;
    }, (err) => {
      console.error(err);
      swal.fire({
        icon: 'error',
        title: 'Ocurrió un error',
        text: err.error.message,

      });
    });
  }
  elimnarFactura(id) {

    let url = URL_SERVICIOS + '/factura/eliminar_factura/' + id;
    url += `?token=${this._usuarioService.token}`;

    return this.http.delete(url).toPromise().then((resp: any) => {
      console.log(resp);
      window.history.back();
      swal.fire({
        icon: 'success',
        title: 'Ingreso Elimnado',
        // text: 'I will close in 2 seconds.',
        timer: 3000,
      });
      return resp.factura;
    });
  }
  pagarPorMonto(body) {

    let url = URL_SERVICIOS + '/factura/pagar_por_monto';
    url += `?token=${this._usuarioService.token}`;

    return this.http.post(url, body).toPromise().then((resp: any) => {
      console.log(resp);
      if (body.confirmado) {
        // swal.fire({
        //   icon: 'success',
        //   title: 'Pago realizado',
        //   text: `Se pagaron ${resp.total} cuota(s)`,
        //   timer: 3000,
        // });
      }
      return resp;
    }, (error) => {
      console.log(error);

      swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.error.error
      });
    }
    );
  }
  async pagarFactura(factura, parcial?: boolean, monto_parcial?: number) {
    console.log(factura);

    let url = URL_SERVICIOS + '/factura/pagar';
    url += `?token=${this._usuarioService.token}`;
    // url += `&caja=${caja._id}`;
    parcial ? url += `&parcial=${parcial}` : null;
    monto_parcial ? url += `&monto_parcial=${monto_parcial}` : null;
    return this.http.post(url, factura).toPromise().then((resp: any) => {
      console.log(resp);
      swal.fire({
        icon: 'success',
        title: 'Factura pagada',
        // text: 'I will close in 2 seconds.',
        timer: 2000,
      });
      return resp.factura;
    }, (error) => {
      console.error(error)
      swal.fire({
        icon: 'error',
        title: 'Error al pagar',
        text: error.error.error,
      });
    });
  }
  getFacturaById(id) {
    let url = `${URL_SERVICIOS}/factura/by_id/${id}`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp.factura;
    });
  }
  getPagosAll(body) {
    let url = `${URL_SERVICIOS}/factura/facturas_excel/listar`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, body).toPromise().then((resp: any) => {
      console.log(resp);

      return resp;
    });
  }
  getPagosExcel(body) {
    let url = `${URL_SERVICIOS}/factura/pagos_excel`;
    url += `?token=${this._usuarioService.token}`;
    // return this.http.post(url, body).toPromise().then((resp: any) => {
    //   window.open(resp)
    // });

    this.http.post(url, body, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));

        downloadLink.setAttribute('download', 'ventas.xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove()
      }
    )
  }
  getReporteIngresos(body) {
    let url = `${URL_SERVICIOS}/factura/cuadro_ingreso`;
    url += `?token=${this._usuarioService.token}`;
    
    this.http.post(url, body, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));

        downloadLink.setAttribute('download', 'cuadro_ingreso.xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove()
      }
    )
  }

  getPagos(cliente_id) {
    let url = `${URL_SERVICIOS}/factura/get_pagos/` + cliente_id;
    url += `?token=${this._usuarioService.token}`;
    // url += `&cliente_id=${cliente_id}`
    console.log(url);

    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp.pagos;
    },
      (err) => {
        console.log(err);

      }
    );
  }
  modificarMonto(body) {
    let url = `${URL_SERVICIOS}/factura/modificar_monto` ;
    url += `?token=${this._usuarioService.token}`;
    console.log("modificar monto", body);
    
    return this.http.put(url, body).toPromise().then((resp: any) => {
      
      return resp;
    },
      (err) => {
        console.log(err);

      }
    );
  }
  getDetallePago(id) {
    let url = `${URL_SERVICIOS}/factura/get_detalle_pago`;
    url += `?token=${this._usuarioService.token}`;
    url += `&id=${id}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp;
    });
  }

  crearLinkDePago(id, fondoId) {
    let url = `${URL_SERVICIOS}/factura/crear_link/${id}/${fondoId}`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);
      swal.fire({
        icon: 'success',
        title: 'Link de pago creado',
        // text: 'I will close in 2 seconds.',
        timer: 2000,
      });
      return resp.factura;
    });
  }

  getFacturasByTitular(id) {
    let url = `${URL_SERVICIOS}/factura/by_titular/${id}`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp.facturas;
    });
  }
  getFacturasByContrato(id) {
    let url = `${URL_SERVICIOS}/factura/all`;
    url += `?token=${this._usuarioService.token}`;
    url += `&contrato=${id}`;

    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp.facturas;
    });
  }

  getFacturas(pagado?, fondo?, start?, end?, page?, titular?, cerrado?) {

    const p = page || 1;
    let url = URL_SERVICIOS + '/factura/all';
    url += `?token=${this._usuarioService.token}`;
    url += `&page=${p}`;
    pagado ? url += `&pagado=${pagado}` : null;
    fondo ? url += `&fondo=${fondo}` : null;
    start ? url += `&start=${start}` : null;
    titular ? url += `&titular=${titular}` : null;
    url += `&cerrado=${cerrado}`;
    end ? url += `&end=${end}` : null;



    return this.http.get(url).toPromise().then((resp: any) => {


      return resp;
    }, (error) => {
      console.log(error);

      swal.fire({ title: 'error', icon: 'error', text: error.error })
    });
  }
  getFacturasOptions(options?: any, sort?) {

    let url = URL_SERVICIOS + '/factura/all';
    url += `?token=${this._usuarioService.token}`;
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value) {
          url += `&${key}=${value}`;
        } else if (value == false) {
          url += `&${key}=${value}`;
        }
      });
    }
    if (sort) {
      url += `&sort_key=${sort.key}`;
      url += `&sort_value=${sort.value}`;
    }
    return this.http.get(url).toPromise().then((resp: any) => {
      console.log('respuesta ');

      return resp;
    }, (error) => {
      console.log(error);

      swal.fire({ title: 'error', icon: 'error', text: error.error.error })
    });
  }
  getFacturasParcial(facturaId) {
    let url = URL_SERVICIOS + '/factura/all';
    url += `?token=${this._usuarioService.token}`;
    url += `&factura_padre_id=${facturaId}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp;
    });
  }
  cancelarPago(pago_id) {
    let url = URL_SERVICIOS + '/factura/cancelar_pago';
    url += `?token=${this._usuarioService.token}`;
    url += `&pago_id=${pago_id}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);
      swal.fire({
        icon: 'success',
        title: 'Pago cancelado',
        timer: 5000
      });
      return resp;
    }, (error) => {
      console.error(error)
      swal.fire({
        icon: 'error',
        title: 'Error al cancelar el pago',
        text: error.error.message
      });
    });
  }

}
