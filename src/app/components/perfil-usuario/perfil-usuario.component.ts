import { WhatsappService } from './../../services/whatsapp.service';
import { ComentarioService } from './../../services/comentario.service';
import { FacturaService } from './../../services/factura.service';
import { Contrato } from './../../models/contrato';
import { ContratoService } from './../../services/contrato.service';
import { Cuota } from './../../models/cuota';
import { CuotaService } from './../../services/cuota.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from './../../models/usuario';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { title } from 'process';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  isVendedor
  isCobrador
  isCliente
  isEmpleado
  isPersona
  isEmpresa
  isBanco
  manejaCaja
  constructor(
    public _usuarioService: UsuarioService,
    public route: ActivatedRoute,
    public _cuotaService: CuotaService,
    public _contratoService: ContratoService,
    public _facturaService: FacturaService,
    public _comentarioService: WhatsappService
  ) { }
  id
  contratos: Contrato[]
  usuario: Usuario
  cuotas: Cuota[]
  facturas
  comentarios
  async ngOnInit() {
    
    this._comentarioService.listen('push_comentarios').subscribe((data: any) => {
      this.comentarios = data

    })
    this._comentarioService.listen('push_comentario').subscribe((data: any) => {
      this.comentarios.push(data)

    })
    this._comentarioService.emitir('get_comentarios', 'e')

    this.id = this.route.snapshot.paramMap.get('id');
    this.usuario = await this._usuarioService.getUsuarioPorId(this.id)
    this.usuario.password = ''

    this.facturas = (await this._facturaService.getFacturas(null, null, null, null, null, this.id)).facturas
 

    this.isVendedor = this.usuario.VENDEDORES == '1' ? 'check_vendedor' : null
    this.isCobrador = this.usuario.COBRADORES == '1' ? 'check_cobrador' : null
    this.isCliente = this.usuario.CLIENTES == '1' ? 'check_cliente' : null
    this.isEmpleado = this.usuario.EMPLEADOS == '1' ? 'check_empleado' : null
    this.isPersona = this.usuario.PERSONA == '1' ? 'check_persona' : null
    this.isEmpresa = this.usuario.EMPRESA == '1' ? 'check_empresa' : null
    this.isBanco = this.usuario.BANCOS == '1' ? 'check_banco' : null
    this.manejaCaja = this.usuario.MANEJA_CAJA == '1' ? 'check_maneja_caja' : null
    this.cuotas = await this._cuotaService.getCuotaByTitular(this.id)
    this.contratos = await this._contratoService.getContratosByTitular(this.id);
  }

  prueba() {

  }

  async actualizarUsuario(usuario) {

    usuario.VENDEDORES = this.isVendedor ? '1' : '0';
    usuario.COBRADORES = this.isCobrador ? '1' : '0';
    usuario.CLIENTES = this.isCliente ? '1' : '0';
    usuario.EMPLEADOS = this.isEmpleado ? '1' : '0';
    usuario.PERSONA = this.isPersona ? '1' : '0';
    usuario.EMPRESA = this.isEmpresa ? '1' : '0';
    usuario.BANCOS = this.isBanco ? '1' : '0';
    usuario.MANEJA_CAJA = this.manejaCaja ? '1' : '0';

    let resp = await this._usuarioService.modificarUsuarios(usuario)
  }

  comentar(texto) {
    let comentario = {
      usuario: this.usuario,
      titular: this._usuarioService.usuario,
      texto: texto
    }
    this._comentarioService.emitir('nuevo_comentario', comentario)
    
    
    this._comentarioService.listen('error').subscribe(data => {
      console.log(data);

    })
  }

}
