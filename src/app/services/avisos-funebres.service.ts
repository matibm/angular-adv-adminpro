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

  // ============================================================================
  // CONDOLENCIAS
  // ============================================================================

  // Obtener estadísticas de condolencias
  getCondolenciasEstadisticas() {
    let url = URL_SERVICIOS + '/avisos-funebres/condolencias/estadisticas';
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.estadisticas;
    });
  }

  // Obtener condolencias pendientes de aprobación
  getCondolenciasPendientes(page: number = 1, limit: number = 20) {
    let url = URL_SERVICIOS + `/avisos-funebres/condolencias/pendientes?page=${page}&limit=${limit}`;
    url += `&token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp;
    });
  }

  // Obtener condolencias de un aviso específico
  getCondolenciasPorAviso(avisoId: string, page: number = 1, limit: number = 20, aprobado?: string) {
    let url = URL_SERVICIOS + `/avisos-funebres/${avisoId}/condolencias?page=${page}&limit=${limit}`;
    if (aprobado !== undefined) {
      url += `&aprobado=${aprobado}`;
    }
    url += `&token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp;
    });
  }

  // Aprobar condolencia
  aprobarCondolencia(condolenciaId: string) {
    let url = URL_SERVICIOS + `/avisos-funebres/condolencias/${condolenciaId}/aprobar`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, {}).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: 'Condolencia aprobada',
        timer: 1500,
        showConfirmButton: false
      });
      return resp;
    });
  }

  // Rechazar condolencia
  rechazarCondolencia(condolenciaId: string) {
    let url = URL_SERVICIOS + `/avisos-funebres/condolencias/${condolenciaId}/rechazar`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, {}).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: 'Condolencia rechazada',
        timer: 1500,
        showConfirmButton: false
      });
      return resp;
    });
  }

  // Aprobar múltiples condolencias
  aprobarCondolenciasMultiple(ids: string[]) {
    let url = URL_SERVICIOS + '/avisos-funebres/condolencias/aprobar-multiple';
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, { ids }).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: resp.message,
        timer: 1500,
        showConfirmButton: false
      });
      return resp;
    });
  }

  // Rechazar múltiples condolencias
  rechazarCondolenciasMultiple(ids: string[]) {
    let url = URL_SERVICIOS + '/avisos-funebres/condolencias/rechazar-multiple';
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, { ids }).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: resp.message,
        timer: 1500,
        showConfirmButton: false
      });
      return resp;
    });
  }

  // ============================================================================
  // RECUERDOS
  // ============================================================================

  getRecuerdosEstadisticas() {
    let url = URL_SERVICIOS + '/avisos-funebres/recuerdos/estadisticas';
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.estadisticas;
    });
  }

  getRecuerdosPendientes(page: number = 1, limit: number = 20) {
    let url = URL_SERVICIOS + `/avisos-funebres/recuerdos/pendientes?page=${page}&limit=${limit}`;
    url += `&token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp;
    });
  }

  getRecuerdosPorAviso(avisoId: string, page: number = 1, limit: number = 20, aprobado?: string) {
    let url = URL_SERVICIOS + `/avisos-funebres/${avisoId}/recuerdos?page=${page}&limit=${limit}`;
    if (aprobado !== undefined) {
      url += `&aprobado=${aprobado}`;
    }
    url += `&token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp;
    });
  }

  aprobarRecuerdo(recuerdoId: string) {
    let url = URL_SERVICIOS + `/avisos-funebres/recuerdos/${recuerdoId}/aprobar`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, {}).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: 'Recuerdo aprobado',
        timer: 1500,
        showConfirmButton: false
      });
      return resp;
    });
  }

  rechazarRecuerdo(recuerdoId: string) {
    let url = URL_SERVICIOS + `/avisos-funebres/recuerdos/${recuerdoId}/rechazar`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, {}).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: 'Recuerdo rechazado',
        timer: 1500,
        showConfirmButton: false
      });
      return resp;
    });
  }

  // ============================================================================
  // FOTOGRAFÍAS
  // ============================================================================

  getFotografiasEstadisticas() {
    let url = URL_SERVICIOS + '/avisos-funebres/fotografias/estadisticas';
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.estadisticas;
    });
  }

  getFotografiasPendientes(page: number = 1, limit: number = 20) {
    let url = URL_SERVICIOS + `/avisos-funebres/fotografias/pendientes?page=${page}&limit=${limit}`;
    url += `&token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp;
    });
  }

  getFotografiasPorAviso(avisoId: string, page: number = 1, limit: number = 20, aprobado?: string) {
    let url = URL_SERVICIOS + `/avisos-funebres/${avisoId}/fotografias?page=${page}&limit=${limit}`;
    if (aprobado !== undefined) {
      url += `&aprobado=${aprobado}`;
    }
    url += `&token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp;
    });
  }

  aprobarFotografia(fotografiaId: string) {
    let url = URL_SERVICIOS + `/avisos-funebres/fotografias/${fotografiaId}/aprobar`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, {}).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: 'Fotografía aprobada',
        timer: 1500,
        showConfirmButton: false
      });
      return resp;
    });
  }

  rechazarFotografia(fotografiaId: string) {
    let url = URL_SERVICIOS + `/avisos-funebres/fotografias/${fotografiaId}/rechazar`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.post(url, {}).toPromise().then((resp: any) => {
      swal.fire({
        icon: 'success',
        title: 'Fotografía rechazada',
        timer: 1500,
        showConfirmButton: false
      });
      return resp;
    });
  }

  // Estadísticas generales de exequias
  getExequiasEstadisticas() {
    let url = URL_SERVICIOS + '/avisos-funebres/exequias/estadisticas';
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.pendientes;
    });
  }

  // Helper para obtener URL de imagen de fotografía (admin)
  getFotografiaUrl(imagenUrl: string): string {
    if (!imagenUrl) return '';
    return `${URL_SERVICIOS}${imagenUrl}?token=${this._usuarioService.token}`;
  }
}

