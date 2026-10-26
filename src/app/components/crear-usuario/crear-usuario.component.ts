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
  guardando = false;
  ngOnInit(): void {
    // this.usuario.fantasia
    this.usuario.fantasia = [{ value: '' }]
    setTimeout(() => {
      this.searchInput.first.nativeElement.focus();

    }, 100);
  }
  async crearUsuario() {
    if (!this.allowCreate()) return;
    this.guardando = true;
    const payload: Usuario = {
      ...this.usuario,
      VENDEDORES: this.isVendedor === true ? '1' : '0',
      PROVEEDORES: this.isProveedor === true ? '1' : '0',
      COBRADORES: this.isCobrador === true ? '1' : '0',
      CONTRATADO: this.isContratado === true ? '1' : '0',
      CLIENTES: this.isCliente === true ? '1' : '0',
      EMPLEADOS: this.isEmpleado === true ? '1' : '0',
      PERSONA: this.isPersona === true ? '1' : '0',
      EMPRESA: this.isEmpresa === true ? '1' : '0',
      BANCOS: this.isBanco === true ? '1' : '0',
      MANEJA_CAJA: this.manejaCaja === true ? '1' : '0',
      NOTAS: this.notas,
      nro_talonario: this.nro_talonario,
      nro_factura_actual: this.nro_factura_actual,
      fecha_creacion: this.fechaCreacion.getTime(),
      fantasia: this.usuario.fantasia.map(nombre => nombre.value)
    };
    try {
      const us = await this._usuarioService.crearUsuario(payload);
      if (us && us._id) this.router.navigateByUrl('/admin/usuario/' + us._id);
    } finally {
      this.guardando = false;
    }
  }

  allowCreate(): boolean {
    if ( !this.guardando && this.usuario.APELLIDOS ) {
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
        confirmButtonText: `Ir a usuario`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
         this.router.navigateByUrl(`/admin/usuario/${consulta[0]._id}`)
        }  
      })
    } else {
      swal.fire({
        icon: 'info',
        title: 'No se encontró ningún usuario',
      });
    }

  }

}
