import { UsuarioService } from './usuario.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  constructor(private router: Router, public _usuario: UsuarioService) {
    this.usuario = _usuario.usuario;
  }
  urlActual;
  menu: any[] = [
    {
      titulo: 'Usuarios',
      icono: 'mdi mdi-account-multiple',
      submenu: [

        { titulo: 'crear usuario', url: 'crear_usuario' },
        { titulo: 'lista de usuarios', url: 'usuarios' },
      ]
    },
    {
      titulo: 'Contratos',
      icono: 'mdi mdi-file-document',
      submenu: [
        { titulo: 'crear contrato', url: 'crear_contrato' },
        { titulo: 'lista de contratos', url: 'lista_contratos' },
       ]
    },
    {
      titulo: 'Finanzas',
      icono: 'mdi mdi-cash',
      submenu: [
        { titulo: 'Ingresos', url: 'cobranzas' },
        { titulo: 'Egresos/Gastos', url: 'gastos' },
        { titulo: 'Cajas/Bancos', url: 'info_caja' },
        { titulo: 'Transf. Deposito', url: 'transferencia' },
        { titulo: 'Facturas a Credito', url: 'recibos' },

      ]
    },
    {
      titulo: 'Reportes',
      icono: 'mdi mdi-home',
      submenu: [
        //  { titulo: 'resumen', url: 'resumen' },
         { titulo: 'Ingresos', url: 'ingresos' },
         { titulo: 'Pagos', url: 'pagos' },

        ]
    },
    {
      titulo: 'Productos',
      icono: 'mdi mdi-shopping',
      submenu: [
        { titulo: 'crear producto', url: 'crear_producto' },
        { titulo: 'lista de productos', url: 'lista_productos' }
       ]
    },
    {
      titulo: 'Mapa',
      icono: 'mdi mdi-map',
      submenu: [
        { titulo: 'mapa', url: 'mapa' }
       ]
    }


  ];
  usuario;

  refreshRoute() {
    this.urlActual = this.router.url;

  }
}
