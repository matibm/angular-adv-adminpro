import { Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { URL_SERVICIOS } from './../config/global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//  import  { io }  from 'socket.io-client';
//  import * as io  from 'socket.io-client';
import { io } from 'socket.io-client/build/index';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {
  socket;
  readonly uri = 'http://localhost:4000';
  constructor(public http: HttpClient,
    public _usuarioService: UsuarioService,
  ) {
    this.socket = io(URL_SERVICIOS);
  }

  generateQr() {
    let url = URL_SERVICIOS + '/whatsapp/generate_qr';
    url += `?token=${this._usuarioService.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.token;
    });
  }

  listen(eventName) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
  emitir(tipo, data) {
    console.log('emitiendo');

    this.socket.emit(tipo, data);

  }
  pruebaSocket() {

  }

  updateDB() {
    this.socket.emit('updateDB')
  }

}
