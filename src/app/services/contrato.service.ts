import { UsuarioService } from './usuario.service';
import { Contrato } from './../models/contrato';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { URL_SERVICIOS } from '../config/global';
import swal from 'sweetalert2';
import { Interface } from 'readline';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  constructor(
    public http: HttpClient
    , public _usuarioService: UsuarioService
  ) { }


  getContratos(page?, options?: { de_baja?: boolean, utilizado?: boolean, fecha_inicio?: number, fecha_fin?: number, nro_contrato?: string, producto?: string, cliente?: string, ruc?: string, manzana?: string, fila?, parcela?: string, tipo?: string }, sort?: { key: string, value: number }) {
    console.log(options);


    const p = page || 1;
    let url = URL_SERVICIOS + '/contrato/all?page=' + p;
    url += `&token=${this._usuarioService.token}`;

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value) {
          url += `&${key}=${value}`;

        }
      });
    }
    if (sort) {
      url += `&sort_key=${sort.key}`;
      url += `&sort_value=${sort.value}`;
    }
    if (options.utilizado === false) {
      url += `&utilizado=false`;
    }
    if (options.de_baja === false) {
      url += `&de_baja=false`;
    }

    return this.http.get(url).toPromise().then((resp: any) => {
      return resp;
    });
  }
  getContratosByTitular(id): Promise<Contrato[]> {

    let url = URL_SERVICIOS + '/contrato/by_titular/' + id;
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp.contrato;
    });
  }
  getContratoById(id): Promise<Contrato> {

    let url = URL_SERVICIOS + '/contrato/by_id/' + id;
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.contrato;
    });
  }
  getMapa(): Promise<any> {

    let url = URL_SERVICIOS + '/contrato/mapa';
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.ubicaciones;
    });
  }
  newContrato(contrato) {
    let url = URL_SERVICIOS + '/contrato/new';
    url += `?token=${this._usuarioService.token}`;

    let timerInterval;
    swal.fire({
      title: 'Creando contrato',
      html: 'Por favor espere unos segundos',
      // timerProgressBar: true,
      didOpen: () => {
        swal.showLoading();

      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });

    return this.http.post(url, contrato).toPromise().then((resp: any) => {
      console.log(resp);
      swal.fire({
        icon: 'success',
        title: 'Contrato creado',
        // text: 'I will close in 2 seconds.',
        timer: 2000,
      });
      return resp.contrato;
    },
      (error) => {
        console.log(error);

        swal.fire({
          icon: 'error',
          title: 'Error  al crear Contrato',
          text: `${error?.error?.message} ${error?.error?.error?.message}`,

        });
      }
    );
  }
  updateContrato(contrato, modifica_producto: boolean, tipoContrato?) {
    console.log(modifica_producto);

    let url = URL_SERVICIOS + '/contrato/edit';
    url += `?token=${this._usuarioService.token}`;
    url += `&modifica_producto=${modifica_producto}`;
    url += `&tipo_contrato=${tipoContrato || ''}`;
    return this.http.post(url, contrato).toPromise().then((resp: any) => {
      console.log(resp);
      window.history.back();

      swal.fire({
        icon: 'success',
        title: 'Contrato modificado',
        // text: 'I will close in 2 seconds.',
        timer: 2000,
      });
      return resp.contrato;
    }, (error) => {
      console.log(error);

      swal.fire({
        icon: 'error',
        title: 'error al actualizar',
        text: error.error.message,

      });
    });
  }

}
