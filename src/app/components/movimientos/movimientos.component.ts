import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductosService } from './../../services/productos.service';
import { ContratoService } from './../../services/contrato.service';
import { Contrato } from './../../models/contrato';
import { UsuarioService } from './../../services/usuario.service';
import { Usuario } from './../../models/usuario';
import { Movimiento } from './../../models/movimiento';
import { MovimientoService } from './../../services/movimiento.service';
import { Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NestableSettings } from 'ngx-nestable/lib/nestable.models';
import {
  MatTreeFlatDataSource,
  MatTreeNestedDataSource,
} from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Observable, Subject, Subscriber } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MovimientoOptions } from 'src/app/models/interfaces/MovimientoOptions';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
})
export class MovimientosComponent implements OnInit, OnDestroy {
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
  cuentaGastoToEdit;
  egresoActive = 'btn-info';
  ingresoActive = 'btn-light';
  showModalCuentas = false;
  cuentasGastos
  categorySelected
  cuentasAbaco
  categorias
  categoria
  categoriaGasto
  categoriaGastos
  cuentaAbaco
  tipoCuentaAbaco
  tipoIva
  inputcuentaAbacos = new Subject<string>();
  inputProveedores = new Subject<string>();
  inputcategorias = new Subject<string>();
  loadingcuentaAbacos
  loadingProveedores
  loadingcategorias
  ocultarOnCategory = false
  fechaCreacion = new Date()
  tipoEdicion
  editandoCuentaGasto = false
  secction = 'listaGastos'
  movimientosOptions: MovimientoOptions = {}
  is_admin_role = false
  fechaVencimientoTimbrado
  @ViewChild('search', { static: false }) searchProveedor;

  rangeReporte = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  constructor(
    public _movimientoService: MovimientoService,
    public _usuarioService: UsuarioService,
    public _contratoService: ContratoService,
    public _productoService: ProductosService,
    // public route: ActivatedRoute,
    private router: Router
  ) { }
  tipos_movimiento;
  tipo;
  pruebaDisabled = true
  async ngOnInit() {
    this._usuarioService.usuario = await this._usuarioService.inicializarUsuario()
    console.log(this._usuarioService?.usuario?.role);
    
    if (this._usuarioService?.usuario?.role != 'ADMIN_ROLE') {            
      this.is_admin_role = false 
    } else{ 
      this.is_admin_role = true

    }







    // this.route.snapshot.queryParams.seccion ? this.secction = this.route.snapshot.queryParams.seccion : this.secction = 'home'
    this.cuentasAbaco = await this._movimientoService.getCuentasAbaco()
    // console.log(this.route.snapshot.queryParams);
    // this.revisarRuta()

    this.observableBuscadores()
    const contratoOfLocal: string = localStorage.getItem('movimiento_contrato');
    contratoOfLocal ? (this.contrato = JSON.parse(contratoOfLocal)) : '';
    if (this.contrato) {
      this.servicio = this.contrato.producto;
      this.cliente = this.contrato.titular;
    }
    this.movimientos = await this._movimientoService.getMovimientos();

    this.servicios = await this._productoService.getProductos();
     this.tipos_movimiento = await this._movimientoService.getTipoMovimiento();
    this.dataSource.data = this.tipos_movimiento;

    //this.movimientos);
    this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', '');
    // this.proveedores = await this._usuarioService.buscarUsuarios(
    //   'PROVEEDORES',
    //   ''
    // );
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '');
    this.loading = false; 
    this.categoriaGastos = await this._movimientoService.getAllCategorias()
    console.log(this.categoriaGastos);
    
  }

  async revisarRuta() {
    // if (this.route.snapshot.queryParams['proveedor']) {
    //  this.proveedor = await this._usuarioService.getUsuarioPorId(this.route.snapshot.queryParams['proveedor'])
    // }
  }


  async selectCategory(tipo) {
    this.tipo = tipo;
    history.forward();
    //tipo);
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
    //this.movimientos);
  }
  async selectCategoryinitial(tipo) {
    this.tipo = tipo;
    history.forward();
    //tipo);
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
    //this.movimientos);
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
      item?.NOMBRES?.toLowerCase().indexOf(term) > -1 ||
      item?.APELLIDOS?.toLowerCase().includes(term) ||
      item?.RAZON?.toLowerCase().includes(term) ||
      item?.RUC?.toLowerCase().includes(term)
    );
  }
  customSearchFnCuentaAbaco(term: string, item: any) {
    term = term.toLowerCase();
    return (
      item?.codigo?.toLowerCase().indexOf(term) > -1 ||
      item?.descripcion?.toLowerCase().includes(term)       
    );
  }
  add(event) {
    //event);
  }
  async navigateBreadcrumb(i) {
    this.tipo = this.breadCrumb[i];

    this.breadCrumb = this.breadCrumb.slice(0, i + 1);
    //this.tipo.ctapadre);

    if (this.tipo.ctapadre == '0') {
      this.tipos_movimiento = await this._movimientoService.getTipoMovimiento(
        2,
        this.tipo.cuenta
      );
      //'cero');
    } else {
      this.tipos_movimiento = await this._movimientoService.getTipoMovimiento(
        2,
        this.tipo.cuenta
      );
    }
    //this.tipos_movimiento);
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
    // this.cambioDeQueryParams('proveedor', proveedor._id)
    let resp: any = await this._movimientoService.getUltimaCuenta(proveedor._id);
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
    let tipoIVA = 'iva10'
    if (this.tipoIva == 'IVA 10%') tipoIVA = 'iva10'
    if (this.tipoIva == 'IVA 5%') tipoIVA = 'iva5'
    if (this.tipoIva == 'EXENTAS') tipoIVA = 'exenta'
    console.log(this.cuentaGasto);
    
    const movimiento: Movimiento = {
      cliente: this.cliente,
      fondo: this.fondo,
      proveedor: this.proveedor,
      comentario: this.comentario,
      fecha_creacion_unix: this.fechaCreacion.getTime(),
      nro_factura: this.nro,
      contrato: this.contrato,
      nro_comp_banco: this.nroFacturaProveedor,
      id_cuentacaja: this.cuentaGasto.cuenta,
      nombre: this.cuentaGasto.descripcion,
      tipo_iva: tipoIVA,  
      monto_haber: montoIngreso,
      monto_total: montoEgreso,
      tipo_movimiento: this.cuentaGasto._id,
      cuenta_padre: this.cuentaGasto.cuentaGasto,
      categoria: this.categoria,
      vencimiento_timbrado: new Date(this.fechaVencimientoTimbrado).getTime()
    };

    const resp = await this._movimientoService.crearMovimiento(movimiento);
    window.location.reload()
    // this.resetAll();
  }
  async searchClientes(val) {
    if (val.term.length > 0) {
      this.clientes = await this._usuarioService.buscarUsuarios(
        'CLIENTES',
        val.term
      );
    }
  }
  ngAfterViewInit(){
    this.searchProveedor.focus()
  }
  goHome(){
    setTimeout(() => {
      this.searchProveedor.focus()
    }, 500);
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
    if (this.fondo && this.monto > 0 ) {
      return true;
    } else {
      return false;
    }
  }
  resetAll() {
    this.fondos = null;
    this.fondo = null;
    this.cliente = null;
    this.clientes = null;
    this.clientes = null;
    this.proveedor = null;
    this.proveedores = null;
    this.nroFacturaProveedor = null;
    this.comentario = null;
    this.monto = null;
    this.nro = null;
    this.cuentaGasto = null;
    this.contrato = null;
    this.fechaCreacion = new Date()
    window.location.reload()
  }
  onContratoSelected(contrato) {
    this.contrato = contrato;
  }
  ocultarOnclickCategory() {

    if (this.ocultarOnCategory) {
      this.showModalCuentas = false
    }
  }
  async cuentaGastoSelected() {
    this.cuentaGasto = await this._movimientoService.getCuentaGastoById(this.cuentaGasto._id)
    this.cuentaAbaco = this.cuentaGasto.cuentaGasto

    console.log(this.cuentaAbaco);

    this.categorySelected = await this._movimientoService.getCuentaGastoByCtaPadre(this.cuentaGasto.ctapadre)
    this.cuentasAbaco = await this._movimientoService.getCuentasAbaco()
    if (this.cuentaGasto.categoria) this.categoria = await this._movimientoService.getCategoriaById(this.cuentaGasto.categoria)
    //this.cuentasAbaco);
    // if (this.cuentasAbaco.length === 1) {
    //   this.cuentaAbaco = this.cuentasAbaco[0]
    // }
  }

  generarReporte(){
    let options = {
      fecha_creacion_unix: {
        $gte: new Date(`${new Date(this.rangeReporte.value.start).toLocaleDateString('en-US')} 00:00`).getTime(),
        $lte: new Date(`${new Date(this.rangeReporte.value.end).toLocaleDateString('en-US')} 23:59:59`).getTime()
      }
    }
    this._movimientoService.getReporteEgresoResumido(options)
  }
  async seleccionarCuentaGastoAEditar(cuentaGasto) {
    this.cuentaGastoToEdit = await this._movimientoService.getCuentaGastoById(cuentaGasto._id)
    if(this.cuentaGastoToEdit.categoria) this.categoriaGasto = await this._movimientoService.getCategoriaById(this.cuentaGastoToEdit.categoria)
    this.cuentaAbaco = this.cuentaGastoToEdit.cuentaGasto
    this.categoriaGastos = await this._movimientoService.getAllCategorias()

    this.cuentaPadreToEdit = await this._movimientoService.getCuentaGastoByCtaPadre(this.cuentaGastoToEdit.ctapadre)
    this.cuentasAbaco = await this._movimientoService.getCuentasAbaco()
    if (this.cuentaGastoToEdit.categoria) this.categoria = await this._movimientoService.getCategoriaById(this.cuentaGastoToEdit.categoria)
    this.editandoCuentaGasto = false
  }
  cuentaPadreToEdit
  editandoCuentaPadre = false;
  async seleccionarCuentaPadreToEdit(cuentaPadre) {
    this.cuentaPadreToEdit = await this._movimientoService.getCuentaGastoById(cuentaPadre._id)
    this.cuentaGastoToEdit.ctapadre = this.cuentaPadreToEdit.cuenta
    this.editandoCuentaPadre = false;

  }

  async crearCuentaGasto(id, nombre, categoria, cuentaAbaco) {
    let cuenta = {
      descripcion: nombre,
      ctapadre: categoria.cuenta,
      cuenta: id,
      nombre_padre: categoria.descripcion,
      id_cuentas: Date.now().toString(),
      cuentaGasto: cuentaAbaco._id
    }
   await this._movimientoService.crearCuentaGasto(cuenta)
   window.location.reload()
  }
  async crearCuentaAbaco(codigo, descripcion, tipo, cuentaGasto) {
    let cuenta = {
      descripcion,
      tipo,
      codigo,

      fecha_unix: new Date().getTime()
    }
    //cuenta);
    await this._movimientoService.crearCuentaAbaco(cuenta)
    window.location.reload()
  }
  crearCategoria(codigo, descripcion) {
    let cuenta = {
      descripcion,
      codigo

    }
    //cuenta);
    this._movimientoService.crearCategoriaGasto(cuenta)
  }
  inputcuentaAbacosPromise
  inputProveedoresPromise
  observableBuscadores() {
    this.inputcuentaAbacosPromise = this.inputcuentaAbacos.pipe(

      debounceTime(300),
      distinctUntilChanged()
    ).toPromise().then(async (txt) => {
      console.log(txt);
      
        if (!txt) {
          return;
        }
        this.loadingcuentaAbacos = true;
        this.cuentasAbaco = await this._movimientoService.searchCuentasAbaco(txt)
        //this.cuentasAbaco);

        this.loadingcuentaAbacos = false;
      })
    this.inputProveedoresPromise = this.inputProveedores.pipe(

      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((async (txt) => {
        if (!txt) {
          return;
        }
         
        this.loadingProveedores = true;
        this.proveedores = await this._usuarioService.buscarUsuarios(
          'PROVEEDORES',
          txt
        );

        this.loadingProveedores = false;
      })
    )
      
    this.inputcategorias.pipe(

      debounceTime(300),
      distinctUntilChanged()
    )
      .toPromise().then(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingcategorias = true;
        this.categorias = await this._movimientoService.searchCategorias(txt)
        //this.categorias);

        this.loadingcategorias = false;
      });

  }
  seleccionarCuentaAbacoToEdit(cuentaAbaco) {
    //cuentaAbaco);
    this.cuentaGastoToEdit.cuentaGasto = cuentaAbaco._id
    // this.cuentaGasto = cuentaAbaco.tipoCuenta
    // this.categorySelected = this.cuentaGasto?.movimiento_padre
  }
  seleccionarCategoriaToEdit(categoria) {
    //categoria);

    this.categoria = categoria
    console.log(categoria);

    if (this.cuentaGasto) {
      this.cuentaGasto.categoria = categoria._id
      this.cuentaAbaco = this.cuentaGasto.cuentaGasto

    }
  }
  cancelarCambiosEditar(seccion?) {
    // if (seccion) this.cambioDeQueryParams('seccion',seccion)
    this.cuentaGasto = null;
    this.categorySelected = null;
    this.categoria = null;
    this.cuentaAbaco = null;

  }

  cambioDeQueryParams(key, seccion) {
    // let queryParams: Params = {... this.route.snapshot.queryParams}
    // queryParams[key] = seccion
    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: queryParams,
    //     skipLocationChange: true
    //     // queryParamsHandling: 'merge', // remove to replace all query params by provided
    //   });
  }

  removeQueryParam(key) {
    // let queryParams: Params = {... this.route.snapshot.queryParams}
    // delete queryParams[key]

    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: queryParams,
    //     // queryParamsHandling: 'merge', // remove to replace all query params by provided
    //   });
  }
  eliminarCuentaGasto(id) {
    this._movimientoService.eliminarCuentaGasto(id)
  }

  async onEditCuentaGasto(cuentaGasto){
    this.categoriaGasto = await this._movimientoService.getCategoriaById(cuentaGasto.categoria)
  }
  async guardarCambios() {
    let body: any = {}
    this.categoria ? body.categoria = this.categoria : ''
    this.cuentaGastoToEdit.categoria = this.categoriaGasto?._id || null
    this.cuentaGastoToEdit ? body.cuenta_gasto = this.cuentaGastoToEdit : ''
    this.cuentaAbaco ? body.cuenta_abaco = this.cuentaAbaco : ''
    console.log(body);

    await this._movimientoService.updateCuentas(body)
    this.cuentaGasto = null;
    this.categorySelected = null;
    this.cuentaGastoToEdit = null;
    this.tipoEdicion = ''
    this.categoria = null;
    this.cuentaAbaco = null;

  }
 
  cancelarEditar() {
    this.cuentaGasto = null;
    this.categorySelected = null;
    this.cuentaGastoToEdit = null;
    this.tipoEdicion = ''
    this.categoria = null;
    this.cuentaAbaco = null;
  }

  goToInfo(id){
    this.router.navigateByUrl('/admin/gasto/'+id)
  }
  ngOnDestroy(){
    // this.inputcuentaAbacosPromise.unsubscribe()
   }
}
