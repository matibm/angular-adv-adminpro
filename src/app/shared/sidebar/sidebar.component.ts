import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, AfterViewInit {  
  class = '';
  menuItems: any[];
  constructor(
    public _usuario: UsuarioService,
    public sidebarService: SidebarService) {
    this.menuItems = sidebarService.menu;
    console.log(this.menuItems);

  }
  usuario
  async ngAfterViewInit() {
    let doc: any = document.getElementById('info_caja')
    let trans: any = document.getElementById('transferencia')
    // if (doc) {
      doc.style = { display : 'none'}
      trans.style = {display : 'none'} 
    // }
    
    console.log(this.sidebarService.usuario?.role);

    this.usuario = await this.sidebarService._usuario.inicializarUsuario()
    if (this.usuario.role === 'ADMIN_ROLE') {
      // if (doc) {
        doc.style = { display : 'block'}
      trans.style = {display : 'block'}
    }
  }
  async ngOnInit() {
    if (!this.sidebarService.usuario) {
     let id = localStorage.getItem('user_id')
     this.usuario = await this._usuario.getUsuarioPorId(id); 
    }
  }


  async onclickParent() {
    let doc:any = document.getElementById('info_caja')
    let trans:any = document.getElementById('transferencia')

    // trans.style.display = 'none'

    // doc.style.display = 'none'
    doc.style = { display : 'none'}
      trans.style = {display : 'none'}


    if(!this.usuario) this.usuario = await this.sidebarService._usuario.inicializarUsuario()
    console.log(this.usuario?.role);
    if (this.usuario.role === 'ADMIN_ROLE') {
      doc.style = { display : 'block'}
      trans.style = {display : 'block'}

    }

  }
  onclickItem(event) {
    this.sidebarService.refreshRoute();
    for (let u = 0; u < event.target.parentElement.parentElement.childNodes.length; u++) {
      const element = event.target.parentElement.parentElement.childNodes[u];
      if (element.firstChild) {
        element.firstChild.classList.remove('active');

      }

    }
    event.target.classList.add('active');
  }

}
