import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_SERVICIOS } from './../config/global';
import { Injectable } from '@angular/core';
import {io} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  socket;
  constructor(public http: HttpClient) {
  this.socket = io(URL_SERVICIOS, { auth: (cb) => cb({ token: localStorage.getItem('token') }) });

  }

  listen(eventName) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
  emitir(tipo, data) {
    console.log('emitien2');

    this.socket.emit(tipo, data);

  }
}
