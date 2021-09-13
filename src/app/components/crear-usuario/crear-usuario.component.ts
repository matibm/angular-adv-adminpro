import { Router } from '@angular/router';
import { Usuario } from './../../models/usuario';
import { UsuarioService } from './../../services/usuario.service';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {

  constructor(public _usuarioService: UsuarioService,
    private router: Router
  ) { }
  @ViewChildren('searchInput') searchInput: QueryList<ElementRef>;

  nivel = 1;
  nro_factura_actual
  nro_talonario
  isVendedor;
  isProveedor;
  isCobrador;
  isContratado;
  isCliente;
  isEmpleado;
  ruc;
  isPersona;
  isEmpresa;
  isBanco;
  manejaCaja;
  usuario: Usuario = {};
  notas = ''
  fechaCreacion = new Date()
  ngOnInit(): void {
    setTimeout(() => {
      this.searchInput.first.nativeElement.focus();

    }, 100);
  }
  async crearUsuario() {
    console.log(this.usuario);
    this.isVendedor == true ? this.usuario.VENDEDORES = '1' : this.usuario.VENDEDORES = '0';
    this.isProveedor == true ? this.usuario.PROVEEDORES = '1' : this.usuario.PROVEEDORES = '0';
    this.isCobrador == true ? this.usuario.COBRADORES = '1' : this.usuario.COBRADORES = '0';
    this.isContratado == true ? this.usuario.CONTRATADO = '1' : this.usuario.CONTRATADO = '0';
    this.isCliente == true ? this.usuario.CLIENTES = '1' : this.usuario.CLIENTES = '0';
    this.isEmpleado == true ? this.usuario.EMPLEADOS = '1' : this.usuario.EMPLEADOS = '0';
    this.isPersona == true ? this.usuario.PERSONA = '1' : this.usuario.PERSONA = '0';
    this.isEmpresa == true ? this.usuario.EMPRESA = '1' : this.usuario.EMPRESA = '0';
    this.isBanco == true ? this.usuario.BANCOS = '1' : this.usuario.BANCOS = '0';
    this.manejaCaja == true ? this.usuario.MANEJA_CAJA = '1' : this.usuario.MANEJA_CAJA = '0';
    this.usuario.NOTAS = this.notas
    this.usuario.nro_talonario = this.nro_talonario
    this.usuario.nro_factura_actual = this.nro_factura_actual
    this.usuario.fecha_creacion = this.fechaCreacion.getTime()
    const us = await this._usuarioService.crearUsuario(this.usuario);
    this.router.navigateByUrl('/admin/usuario/' + us._id);
  }

  allowCreate(): boolean {
    if (this.usuario.NOMBRES && this.usuario.APELLIDOS && this.usuario.TELEFONO1) {
      return true;
    } else {
      return false;
    }
  }


  async consultar(ruc) {
    if (!ruc) {
      return;
    }
    const consulta = await this._usuarioService.buscarUsuarios('ALL', ruc);

    if (consulta[0]) {
      swal.fire({
        icon: 'success',
        title: 'Usuario Existente',
        text: `${consulta[0].NOMBRES} ${consulta[0].APELLIDOS} RUC/CI: ${consulta[0].RUC}`,
        timer: 3000,
      });
    } else {
      swal.fire({
        icon: 'info',
        title: 'No se encontró ningún usuario',
      });
    }

  }

}
