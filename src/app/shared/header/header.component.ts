import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  constructor(
    private _usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
  }

  logout(){
    this._usuarioService.logout()
  }
}
