import { UsuarioService } from './usuario.service';
import { URL_SERVICIOS } from './../config/global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cuota } from '../models/cuota';
@Injectable({
  providedIn: 'root'
})
export class CuotaService {

  constructor(
    public http: HttpClient, public _usuarioService: UsuarioService
  ) { }


  getCuotaByTitular(idTitular): Promise<Cuota[]> {
    let url = `${URL_SERVICIOS}/cuota/by_titular/${idTitular}`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp.cuotas;
    });
  }
  getCuotaById(id){
    let url = `${URL_SERVICIOS}/factura/by_id/${id}`;
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      console.log(resp);

      return resp.factura;
    });
  }

}
