import swal from 'sweetalert2';
import { URL_SERVICIOS } from './../config/global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  itsLogued = false;
  token;
  user_id;
  usuario;
  constructor(
    public http: HttpClient
  ) {
    console.log("constructor usuariooooooooooooooooooo");

    this.token = localStorage.getItem('token');
    this.user_id = localStorage.getItem('user_id');
    this.itsLogued = this.token ? true : false;

    this.inicializarUsuario();
  }

  async inicializarUsuario(): Promise<Usuario> {
    let id = localStorage.getItem('user_id')
    if (id) {
      this.usuario = await this.getUsuarioPorId(this.user_id);
      return this.usuario
    } else {
      return null
    }

  }
  getUsuarios() {
    let url = URL_SERVICIOS + '/usuario/all';
    url += `?token=${this.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.usuarios;
    });
  }

  getUsuarioPorId(id): Promise<Usuario> {
    let url = URL_SERVICIOS + `/usuario/id/${id}`;
    url += `?token=${this.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.usuario;
    });
  }

  getClientes() {
    let url = URL_SERVICIOS + '/usuario/clientes';
    url += `?token=${this.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.usuarios;
    });
  }
  getVendedores() {
    let url = URL_SERVICIOS + '/usuario/vendedores';
    url += `?token=${this.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.usuarios;
    });
  }
  getCobradores() {
    let url = URL_SERVICIOS + '/usuario/cobradores';
    url += `?token=${this.token}`;
    return this.http.get(url).toPromise().then((resp: any) => {
      return resp.usuarios;
    });
  }

  eliminarUsuario(id) {
    let url = `${URL_SERVICIOS}/usuario/soft_delete_user/${id}`;
    url += `?token=${this.token}`;
    return this.http.delete(url).toPromise().then((resp: any) => {

      swal.fire({
        icon: 'success',
        title: resp.message,
        timer: 3000,
      });
    },
      (err) => {
        console.error(err);
        swal.fire({
          icon: 'error',
          title: err.error.message          
        });
        
      }
    );
  }
  buscarUsuarios(tipo, busqueda) {
    console.log('buscando', busqueda);

    let url = `${URL_SERVICIOS}/usuario/search/${tipo}`;
    url += `?token=${this.token}`;
    url += `&query=${busqueda}`;
    return this.http.post(url, { type: tipo, query: busqueda }).toPromise().then((resp: any) => {
      return resp.usuarios;
    });
  }
  modificarUsuarios(usuario) {
    let url = `${URL_SERVICIOS}/usuario/edit/${usuario._id}`;
    url += `?token=${this.token}`;
    return this.http.put(url, usuario).toPromise().then((resp: any) => {
      console.log(resp);

      swal.fire({
        icon: 'success',
        title: 'Usuario modificado',
        // text: 'I will close in 2 seconds.',
        timer: 2000,
      });
      return resp;
    });
  }

  crearUsuario(usuario) {
    let url = `${URL_SERVICIOS}/usuario/crear_usuario`;
    url += `?token=${this.token}`;
    return this.http.post(url, usuario).toPromise().then((resp: any) => {
      console.log(resp);
      swal.fire({
        icon: 'success',
        title: 'Usuario creado',
        // text: 'I will close in 2 seconds.',
        timer: 2000,
      });
      return resp.usuario;
    }, (error) => {
      swal.fire({
        icon: 'error',
        title: 'Error al crear usuario',
        text: error

      });
      return error;
    });
  }

  login(usuario) {
    console.log(usuario);

    const url = `${URL_SERVICIOS}/usuario/login`;
    return this.http.post(url, usuario).toPromise().then((resp: any) => {
      console.log(resp);
      this.usuario = resp.user;
      this.user_id = resp.user._id;
      localStorage.setItem('user_id', this.user_id);
      return resp;
    });
  }

  logout() {
    this.token = '';
    localStorage.removeItem('token');
    this.itsLogued = false;
  }
  getConfigurations(body) {


    let url = `${URL_SERVICIOS}/configurations/get_configurations`;
    url += `?token=${this.token}`;

    return this.http.post(url, body).toPromise().then((resp: any) => {
      return resp.data;
    });
  }

  createConfiguration(body) {

    let url = `${URL_SERVICIOS}/configurations/create_configuration`;
    url += `?token=${this.token}`;

    return this.http.post(url, body).toPromise().then((resp: any) => {
      return resp.data;
    });
  }

}
