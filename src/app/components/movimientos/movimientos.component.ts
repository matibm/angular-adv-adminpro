import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductosService } from './../../services/productos.service';
import { ContratoService } from './../../services/contrato.service';
import { Contrato } from './../../models/contrato';
import { UsuarioService } from './../../services/usuario.service';
import { Usuario } from './../../models/usuario';
import { Movimiento } from './../../models/movimiento';
import { MovimientoService } from './../../services/movimiento.service';
import { Component, DoCheck, OnInit } from '@angular/core';
import { NestableSettings } from 'ngx-nestable/lib/nestable.models';
import {
  MatTreeFlatDataSource,
  MatTreeNestedDataSource,
} from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
})
export class MovimientosComponent implements OnInit {
  breadCrumb = [];
  movimientos: Movimiento[] = [];
  arrayBreadCrumb = [];
  cliente: Usuario;
  clientes: Usuario[];
  proveedor: Usuario;
  proveedores: Usuario[];
  fondo: Usuario;
  fondos: Usuario[];
  nro;
  showCrearMovimiento = false;
  showCrearMovimientoLocal = 'false';
  nroFacturaProveedor;
  fechaMovimiento;
  monto: number;
  comentario;
  servicio;
  servicios;
  loading = false;
  contrato: Contrato;
  dataSource = new MatTreeNestedDataSource<any>();
  treeControl = new NestedTreeControl<any>((node) => node.hijos);
  hasChild = (_: number, node: any) => !!node.hijos && node.hijos.length > 0;
  showModal;
  cuentaGasto;
  egresoActive = 'btn-info';
  ingresoActive = 'btn-light';
  showModalCuentas = false;
  cuentasGastos 
  categorySelected
  
  constructor(
    public _movimientoService: MovimientoService,
    public _usuarioService: UsuarioService,
    public _contratoService: ContratoService,
    public _productoService: ProductosService
  ) {}
  tipos_movimiento;
  tipo;
  pruebaDisabled = true
  async ngOnInit() {
    this.observableBuscadores()
    const contratoOfLocal: string = localStorage.getItem('movimiento_contrato');
    contratoOfLocal ? (this.contrato = JSON.parse(contratoOfLocal)) : '';
    if (this.contrato) {
      this.servicio = this.contrato.producto;
      this.cliente = this.contrato.titular;
    }

    this.servicios = await this._productoService.getProductos();
    this.loading = true;
    this.tipos_movimiento = await this._movimientoService.getTipoMovimiento();
    this.dataSource.data = this.tipos_movimiento;

    this.movimientos = await this._movimientoService.getMovimientos();
    console.log(this.movimientos);
    this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', '');
    this.proveedores = await this._usuarioService.buscarUsuarios(
      'PROVEEDORES',
      ''
    );
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '');
    this.loading = false;
    this.initializeWithLocalStorage();
  }

  async selectCategory(tipo) {
    this.tipo = tipo;
    history.forward();
    console.log(tipo);
    if (!tipo) {
      return;
    }
    this.breadCrumb.push(tipo);
    this.saveBreadcrumb();
    const padre = tipo.nombre_padre ? tipo.nombre_padre : tipo.descripcion;
    this.tipos_movimiento = await this._movimientoService.getTipoMovimiento(
      this.breadCrumb.length + 1,
      tipo.cuenta
    );
    this.movimientos = await this._movimientoService.getMovimientos(
      tipo.cuenta
    );
    console.log(this.movimientos);
  }
  async selectCategoryinitial(tipo) {
    this.tipo = tipo;
    history.forward();
    console.log(tipo);
    if (!tipo) {
      return;
    }
    this.saveBreadcrumb();
    const padre = tipo.nombre_padre ? tipo.nombre_padre : tipo.descripcion;
    this.tipos_movimiento = await this._movimientoService.getTipoMovimiento(
      this.breadCrumb.length + 1,
      tipo.cuenta
    );
    this.movimientos = await this._movimientoService.getMovimientos(
      tipo.cuenta
    );
    console.log(this.movimientos);
  }

  async searchTipoMovimientos(event) {
    if (this.breadCrumb.length > 0 && event.term) {
      this.tipos_movimiento =
        await this._movimientoService.buscarTipoMovimientos(
          event.term,
          this.breadCrumb.length + 1
        );
    }
  }
  customSearchFnMovimientos(term: string, item: any) {
    term = term.toLowerCase();
    return (
      item.descripcion.toLowerCase().indexOf(term) > -1 ||
      item.nombre_padre.toLowerCase().includes(term)
    );
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return (
      item.NOMBRES.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS.toLowerCase().includes(term) ||
      item.RAZON.toLowerCase().includes(term) ||
      item.RUC.toLowerCase().includes(term)
    );
  }

  add(event) {
    console.log(event);
  }

  async navigateBreadcrumb(i) {
    this.tipo = this.breadCrumb[i];

    this.breadCrumb = this.breadCrumb.slice(0, i + 1);
    console.log(this.tipo.ctapadre);

    if (this.tipo.ctapadre == '0') {
      this.tipos_movimiento = await this._movimientoService.getTipoMovimiento(
        2,
        this.tipo.cuenta
      );
      console.log('cero');
    } else {
      this.tipos_movimiento = await this._movimientoService.getTipoMovimiento(
        2,
        this.tipo.cuenta
      );
    }
    console.log(this.tipos_movimiento);
    this.movimientos = await this._movimientoService.getMovimientos(
      this.tipo.cuenta
    );
    this.saveBreadcrumb();
  }

  async resetBreadcrumb() {
    this.tipos_movimiento = await this._movimientoService.getTipoMovimiento();
    this.breadCrumb = [];
    this.movimientos = [];
    this.saveBreadcrumb();
    this.saveshowCrearMovimiento(false);
  }

  async onSelectProveedor(proveedor) {
     let resp:any = await this._movimientoService.getUltimaCuenta(proveedor._id);
     this.cuentaGasto = resp.cuenta
     this.fondo = resp.fondo
  }

  async crearMovimiento() {
    let montoEgreso;
    let montoIngreso;

    if (this.egresoActive == 'btn-info') {
      montoEgreso = this.monto;
      montoIngreso = 0;
    } else {
      montoEgreso = 0;
      montoIngreso = this.monto;
    }
    const movimiento: Movimiento = {
      cliente: this.cliente,
      fondo: this.fondo,
      proveedor: this.proveedor,
      comentario: this.comentario,
      fecha_creacion_unix: new Date().getTime(),
      nro_factura: this.nro,
      contrato: this.contrato,
      nro_comp_banco: this.nroFacturaProveedor,
      id_cuentacaja: this.cuentaGasto.cuenta,
      nombre: this.cuentaGasto.descripcion,
      anulado: '0',
      monto_haber: montoIngreso,
      monto_total: montoEgreso,
      tipo_movimiento: this.cuentaGasto._id
    };

    const resp = await this._movimientoService.crearMovimiento(movimiento);

    this.resetAll();
  }

  async searchClientes(val) {
    if (val.term.length > 0) {
      this.clientes = await this._usuarioService.buscarUsuarios(
        'CLIENTES',
        val.term
      );
    }
  }
  async searchProveedores(val) {
    if (val.term.length > 0) {
      this.proveedores = await this._usuarioService.buscarUsuarios(
        'PROVEEDORES',
        val.term
      );
    }
  }
  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }

  async buscarContratoPorNro(nro_contrato) {
    const respC = await this._contratoService.getContratos(null, {
      nro_contrato,
    });
    if (respC.contratos.length == 1) {
      this.contrato = respC.contratos[0];
    }
  }

  saveBreadcrumb() {
    localStorage.setItem(
      'movimiento_breadcrumb',
      JSON.stringify(this.breadCrumb)
    );
  }
  saveshowCrearMovimiento(value) {
    this.showCrearMovimiento = value;
    this.showCrearMovimientoLocal = `${value}`;
    localStorage.setItem(
      'movimiento_show_crear_movimiento',
      this.showCrearMovimientoLocal
    );
  }

  initializeWithLocalStorage() {
    const showCrearMovimiento = localStorage.getItem(
      'movimiento_show_crear_movimiento'
    );
    if (showCrearMovimiento == 'true') {
      this.showCrearMovimiento = true;
    } else if (showCrearMovimiento == 'false') {
      this.showCrearMovimiento = false;
    }

    const existsbreacrumb = JSON.parse(
      localStorage.getItem('movimiento_breadcrumb')
    );
    existsbreacrumb ? (this.breadCrumb = existsbreacrumb) : '';
    if (this.breadCrumb) {
      this.selectCategoryinitial(this.breadCrumb[this.breadCrumb.length - 1]);
    }
  }

  removeContrato() {
    this.contrato = null;
    localStorage.setItem('movimiento_contrato', null);
  }

  switchTipoMonto() {
    if (this.egresoActive == 'btn-info') {
      this.egresoActive = 'btn-light';
      this.ingresoActive = 'btn-info';
    } else {
      this.ingresoActive = 'btn-light';
      this.egresoActive = 'btn-info';
    }
  }

  allowCreateMovimiento(): boolean {
    if (this.fondo && this.monto > 0) {
      return true;
    } else {
      return false;
    }
  }

  resetAll() {
    this.resetBreadcrumb();
    this.ngOnInit();
  }

  onContratoSelected(contrato) {
    this.contrato = contrato;
  }
  ocultarOnCategory = false
  ocultarOnclickCategory(){
    console.log(this.ocultarOnCategory);
    
    if (this.ocultarOnCategory) {
      this.showModalCuentas = false
    }
  }
  cuentasAbaco
  cuentaAbaco
  async cuentaGastoSelected(){
    this.cuentasAbaco = await this._movimientoService.getCuentasAbaco(this.cuentaGasto._id)
    console.log(this.cuentasAbaco);    
    if (this.cuentasAbaco.length === 1) {
      this.cuentaAbaco = this.cuentasAbaco[0]
    }
  }

  crearCuentaGasto(nombre, categoria){
    let cuenta = {
      descripcion: nombre,
      ctapadre: categoria.cuenta,
      cuenta: Date.now().toString()
    }
    this._movimientoService.crearCuentaGasto(cuenta)
  }
  tipoCuentaAbaco
  crearCuentaAbaco(codigo, descripcion, tipo, cuentaGasto){
    let cuenta = {
      descripcion,
      tipo,
      codigo,
      tipoCuenta: cuentaGasto._id,
      fecha_unix: new Date().getTime()
    }
    console.log(cuenta);    
    this._movimientoService.crearCuentaAbaco(cuenta)
  }

  inputcuentaAbacos = new Subject<string>();
  loadingcuentaAbacos
  

  
  observableBuscadores() {
    this.inputcuentaAbacos.pipe(

      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingcuentaAbacos = true;
        this.cuentasAbaco = await this._movimientoService.searchCuentasAbaco(txt)
        console.log(this.cuentasAbaco);
        
        this.loadingcuentaAbacos = false;
      });
 
  }


  seleccionarCuentaAbacoToEdit(cuentaAbaco){
    console.log(cuentaAbaco);
    
    this.cuentaGasto = cuentaAbaco.tipoCuenta
    this.categorySelected = this.cuentaGasto?.movimiento_padre
  }
  cancelarCambiosEditar(){
    this.cuentaGasto = null;
    this.categorySelected = null;
    this.cuentaAbaco = null;
    this.cuentasAbaco = null
  }

}
