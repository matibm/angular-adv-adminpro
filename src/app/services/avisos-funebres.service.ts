import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from './../config/global';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AvisosFunebresService {
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getAvisosFunebres(page: number = 1, limit: number = 10) {
    let url = URL_SERVICIOS + `/avisos-funebres/all?page=${page}&limit=${limit}`;
    url += `&token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp; // Devolvemos toda la respuesta para tener access al total
    });
  }

  getAvisoFunebreById(id) {
    let url = URL_SERVICIOS + '/avisos-funebres/by_id/' + id;
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.aviso;
    });
  }

  getAvisosPublicos() {
    let url = URL_SERVICIOS + '/avisos-funebres/publicos';
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.avisos;
    });
  }

  crearAvisoFunebre(formData: FormData) {
    let url = URL_SERVICIOS + '/avisos-funebres/crear';
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, formData).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: resp.message,
        timer: 2000,
      });
      return resp;
    });
  }

  actualizarAvisoFunebre(formData: FormData) {
    let url = URL_SERVICIOS + '/avisos-funebres/update';
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, formData).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: resp.message,
        timer: 2000,
      });
      return resp;
    });
  }

  eliminarAvisoFunebre(id: string) {
    let url = URL_SERVICIOS + '/avisos-funebres/eliminar/' + id;
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, {}).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: resp.message,
        timer: 2000,
      });
      return resp;
    });
  }
}

