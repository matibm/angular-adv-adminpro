import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from './../config/global';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  constructor(
    public http: HttpClient, public _usuarioService: UsuarioService
  ) { }

  getProductos() {
    let url = URL_SERVICIOS + '/producto/all';
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.productos;
    });
  }


  getProductoById(id) {
    let url = URL_SERVICIOS + '/producto/by_id/' + id;
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.producto;
    });
  }


  crearProducto(producto) {
    let url = URL_SERVICIOS + '/producto/crear-producto';
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, producto).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: resp.message,
        // text: 'I will close in 2 seconds.',
        timer: 2000,
      });
      return resp;
    });
  }
  actualizarProducto(producto) {
    let url = URL_SERVICIOS + '/producto/update';
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, producto).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: resp.message,
        // text: 'I will close in 2 seconds.',
        timer: 2000,
      });
      return resp;
    });
  }


}
