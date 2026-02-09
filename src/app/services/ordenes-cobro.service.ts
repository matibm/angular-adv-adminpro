import { URL_SERVICIOS } from '../config/global';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrdenesCobroService {
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService,
  ) {}

  getOrdenes(estado?: string, page = 1, limit = 20) {
    let url = URL_SERVICIOS + '/ordenes-cobro/all';
    url += `?token=${this._usuarioService.token}`;
    if (estado) url += `&estado=${estado}`;
    url += `&page=${page}&limit=${limit}`;
    return this.http.get(url).toPromise();
  }

  getOrdenById(id: string) {
    const url = URL_SERVICIOS + '/ordenes-cobro/by_id/' + id + `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise();
  }

  crearOrden(documento: string, factura_ids: string[], monto_total: number, email?: string) {
    const url = URL_SERVICIOS + '/ordenes-cobro/crear';
    const body: any = { documento, factura_ids, monto_total };
    if (email) body.email = email;
    return this.http.post(url, body).toPromise();
  }

  getConfigPagosOnline() {
    const url = URL_SERVICIOS + '/ordenes-cobro/config-pagos-online?token=' + this._usuarioService.token;
    return this.http.get(url).toPromise();
  }

  saveConfigPagosOnline(cobrador_id: string | null, fondo_id: string | null) {
    const url = URL_SERVICIOS + '/ordenes-cobro/config-pagos-online?token=' + this._usuarioService.token;
    return this.http.put(url, { cobrador_id, fondo_id }).toPromise();
  }

  getCobradores() {
    const url = URL_SERVICIOS + '/ordenes-cobro/cobradores?token=' + this._usuarioService.token;
    return this.http.get(url).toPromise();
  }

  getFondos() {
    const url = URL_SERVICIOS + '/ordenes-cobro/fondos?token=' + this._usuarioService.token;
    return this.http.get(url).toPromise();
  }
}
