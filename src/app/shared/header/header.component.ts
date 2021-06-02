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
    public _usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
  }

  open(){
    console.log('openes');

    setTimeout(() => {
    // document.body.classList.remove('show-sidebar');

    }, 300);
  }

  logout(){
    this._usuarioService.logout();
  }

}
