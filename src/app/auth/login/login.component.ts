import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private _usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
  }

  async login(email, password) {
    const usuario = {
      EMAIL: email,
      password
    };
    const resp = await this._usuarioService.login(usuario);
    if (resp.ok == true) {
      localStorage.setItem('token', resp.token);
      this._usuarioService.token = resp.token;
      this._usuarioService.itsLogued = true;
      this.router.navigateByUrl('/');
    }
  }

}
