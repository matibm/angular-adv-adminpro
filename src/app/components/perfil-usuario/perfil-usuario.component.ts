import { MovimientoService } from './../../services/movimiento.service';
import { Movimiento } from './../../models/movimiento';
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
  nro_factura_actual
  nro_talonario
  isVendedor;
  isCobrador;
  isCliente;
  isEmpleado;
  movimientos: Movimiento[];
  isPersona;
  isEmpresa;
  isContratado;
  isBanco;
  isProveedor;
  manejaCaja;
  cobroOnline;
  pagos;
  contratosActivosCount = 0
  contratosActivosPage = 1
  contratosInactivosCount = 0
  contratosInactivosPage = 1
  facturapdf;
  contratosActivosOptios: any = {}
  contratosInactivosOptios: any = {}
  constructor(
    public _usuarioService: UsuarioService,
    public route: ActivatedRoute,
    public _cuotaService: CuotaService,
    public _contratoService: ContratoService,
    public _facturaService: FacturaService,
    public _comentarioService: WhatsappService,
    public _movimientoService: MovimientoService
  ) { }
  id;
  contratos: Contrato[];
  contratosInactivos: Contrato[];
  usuario: Usuario;
  cuotas: Cuota[];
  facturas;
  comentarios;
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.contratosActivosOptios.cliente = this.id
    this.contratosActivosOptios.utilizado = false
    this.contratosActivosOptios.de_baja = false
    this.contratosInactivosOptios.cliente = this.id
    this.contratosInactivosOptios.utilizado = true
    this.contratosInactivosOptios.de_baja = false
    this.pagos = await this._facturaService.getPagos(this.id);
    // console.log("pagos", this.pagos);

    this._comentarioService.listen('push_comentarios').subscribe((data: any) => {
      this.comentarios = data;

    });
    this._comentarioService.listen('push_comentario').subscribe((data: any) => {
      this.comentarios.push(data);

    });
    this._comentarioService.emitir('get_comentarios', 'e');

    this.usuario = await this._usuarioService.getUsuarioPorId(this.id);
    console.log(this.usuario);

    this.usuario.password = null;

    this.facturas = (await this._facturaService.getFacturas(null, null, null, null, null, this.id)).facturas;


    this.isVendedor = this.usuario.VENDEDORES == '1' ? 'check_vendedor' : null;
    this.isCobrador = this.usuario.COBRADORES == '1' ? 'check_cobrador' : null;
    this.isCliente = this.usuario.CLIENTES == '1' ? 'check_cliente' : null;
    this.isEmpleado = this.usuario.EMPLEADOS == '1' ? 'check_empleado' : null;
    this.isPersona = this.usuario.PERSONA == '1' ? 'check_persona' : null;
    this.isEmpresa = this.usuario.EMPRESA == '1' ? 'check_empresa' : null;
    this.isContratado = this.usuario.CONTRATADO == '1' ? 'check_contratado' : null;
    this.isBanco = this.usuario.BANCOS == '1' ? 'check_banco' : null;
    this.isProveedor = this.usuario.PROVEEDORES == '1' ? 'check_proveedor' : null;
    this.manejaCaja = this.usuario.MANEJA_CAJA == '1' ? 'check_maneja_caja' : null;
    this.cobroOnline = this.usuario.fondo_online == '1' ? 'check_maneja_caja' : null;
    this.cuotas = await this._cuotaService.getCuotaByTitular(this.id);
    // this.contratos = await this._contratoService.getContratosByTitular(this.id);
    let contratosActivosResp = (await this._contratoService.getContratos(1, { cliente: this.id, utilizado: false }))
    console.log(contratosActivosResp);

    this.contratos = contratosActivosResp.contratos

    const contratosInactivosResp = (await this._contratoService.getContratos(1, { cliente: this.id, utilizado: null }))
    this.contratosInactivosCount = contratosInactivosResp.count
    this.contratosInactivos = contratosInactivosResp.contratos
    console.log(contratosInactivosResp);

    this.movimientos = (await this._movimientoService.getAllMovimientos({ cliente: this.id })).movimientos;
  }

  prueba() {

  }

  async actualizarUsuario(usuario: Usuario) {
    console.log(this.nro_factura_actual);

    usuario.VENDEDORES = this.isVendedor ? '1' : '0';
    usuario.COBRADORES = this.isCobrador ? '1' : '0';
    usuario.CLIENTES = this.isCliente ? '1' : '0';
    usuario.EMPLEADOS = this.isEmpleado ? '1' : '0';
    usuario.PERSONA = this.isPersona ? '1' : '0';
    usuario.EMPRESA = this.isEmpresa ? '1' : '0';
    usuario.CONTRATADO = this.isContratado ? '1' : '0';
    usuario.BANCOS = this.isBanco ? '1' : '0';
    usuario.PROVEEDORES = this.isProveedor ? '1' : '0';
    usuario.MANEJA_CAJA = this.manejaCaja ? '1' : '0';
    usuario.fondo_online = this.cobroOnline ? '1' : '0';
    // usuario.nro_factura_actual = this.nro_factura_actual
    // usuario.nro_talonario = this.nro_talonario
    const resp = await this._usuarioService.modificarUsuarios(usuario);
  }

  comentar(texto) {
    const comentario = {
      usuario: this.usuario,
      titular: this._usuarioService.usuario,
      texto
    };
    this._comentarioService.emitir('nuevo_comentario', comentario);


    this._comentarioService.listen('error').subscribe(data => {
      console.log(data);

    });
  }

  async mostrarModal(id) {
    const resp = await this._facturaService.getDetallePago(id);
    console.log(resp);

    const pago = resp.pago;
    const facturas = resp.facturas;
    const servicios = [];
    for (let i = 0; i < facturas.length; i++) {
      const factura = facturas[i];
      servicios.push({
        cantidad: 1,
        concepto: factura.servicio.NOMBRE,
        precioUnitario: factura.haber,
        cincoPorciento: null,
        diezPorciento: factura.haber / 11
      });
    }
    this.facturapdf = {
      _id: pago._id,
      comentario: pago.comentario,
      activo: pago.activo,
      nombres: `${pago.cliente.NOMBRES} ${pago.cliente.APELLIDOS}`,
      fecha: pago.fecha_creacion,
      direccion: `direccion de prueba`,
      ruc: pago.cliente.RUC,
      tel: pago.cliente.TELEFONO1,
      notaDeRemision: '123123',
      servicios,
      nro_talonario: this.usuario.nro_talonario,
      nro_factura: this.usuario.nro_factura_actual + 1
    };
    console.log(this.facturapdf);

  }

  async pageChangeContratosInactivos(page) {
    console.log(page);
    let contratosInactivosResp = (await this._contratoService.getContratos(page, { cliente: this.id, tipo: 'inactivo' }))

    this.contratosInactivos = contratosInactivosResp.contratos
  }
  async pageChangeContratosActivos(page) {
    console.log(page);
    let contratosActivosResp = (await this._contratoService.getContratos(page, { cliente: this.id, utilizado: false }))

    this.contratos = contratosActivosResp.contratos
  }
}
