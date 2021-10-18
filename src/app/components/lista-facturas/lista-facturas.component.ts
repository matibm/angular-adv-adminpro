import { FormGroup, FormControl } from '@angular/forms';
import { ContratoService } from './../../services/contrato.service';
import { Producto } from './../../models/producto';
import { UsuarioService } from './../../services/usuario.service';
import { ProductosService } from './../../services/productos.service';
import { FacturaService } from './../../services/factura.service';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.component.html',
  styleUrls: ['./lista-facturas.component.css']
})
export class ListaFacturasComponent implements OnInit {

  constructor(public _facturaService: FacturaService,
    public _usuarioService: UsuarioService,
    public _contratoSerivce: ContratoService,
    public _productoService: ProductosService,
    notifier: NotifierService,
    public route: ActivatedRoute,
    private router: Router

  ) {

    this.notifier = notifier;
  }

  private notifier: NotifierService;

  showModal = false;
  opciones: any = { get_total: '1' }
  montoTotal
  fondo;
  fondos;
  fechaEmisionStart;
  fechaEmisionEnd;
  fechaVencimientoStart;
  fechaVencimientoEnd;
  fechaPagadoStart;
  fechaPagadoEnd;
  cliente;
  clientes;
  servicio;
  servicios;
  facturas;
  cobrador;
  cobradores;
  vendedor;
  vendedores;
  count;
  contratos;
  contrato;
  facturasAPagar;
  inputClientes = new Subject<string>();
  loadingClientes = false
  inputCobradores = new Subject<string>();
  loadingCobradores = false
  inputVendedores = new Subject<string>();
  loadingVendedores = false
  utilizado
  de_baja = false
  is_admin_role = false
  estados = [
    {
      id: 1,
      estado: 'TODOS',
      color: 'dark'
    },
    {
      id: 2,
      estado: 'PAGADOS',
      color: 'dark'
    },
    {
      id: 3,
      estado: 'PENDIENTES',
      color: 'danger'
    },

  ];


  cod_servicios = ['P.S.V.', 'P.S.M.', 'C.M.P.', 'A.C.F.', 'U.D.P.']
  estadoSeleccionado = 'TODOS';
  codSeleccionado = null

  rangeEmision = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  rangeReporte = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  rangeVencimiento = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  rangePagado = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  sort = {
    key: 'vencimiento', value: 1
  }
  cambiarQueryParams(paths) {
    let queryParams: Params = { ... this.route.snapshot.queryParams }
    for (let i = 0; i < paths.length; i++) {
      const element = paths[i];
      Object.keys(element).forEach((key, index) => {
        queryParams[key] = element[key]
        if (!element[key]) {
          delete queryParams[key]
        }
      })

    }
    console.log(queryParams);

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        // skipLocationChange: true
        // queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }
  async ngOnInit() {
    this._usuarioService.usuario = await this._usuarioService.inicializarUsuario()
    console.log(this._usuarioService?.usuario?.role);

    if (this._usuarioService?.usuario?.role != 'ADMIN_ROLE') {
      console.log(await this.setUsuarioCobrador(this._usuarioService?.usuario?._id));

      this.is_admin_role = false
    } else {
      this.is_admin_role = true

    }



    if (!this.route.snapshot.queryParams.vencimiento_start && !this.route.snapshot.queryParams.vencimiento_end) {
      let month = new Date().getMonth() + 1
      let year = new Date().getFullYear()
      // this.rangeVencimiento.setValue({ start: new Date(`${year}-${month}-01`), end: new Date() })
      // this.cambiarQueryParams([
      //   {
      //     vencimiento_start: new Date(`${year}-${month}-01`).toLocaleDateString('fr-CA', { year: "numeric", month: "2-digit", day: "2-digit" })
      //   },
      //   {
      //     vencimiento_end: new Date().toLocaleDateString('fr-CA', { year: "numeric", month: "2-digit", day: "2-digit" })
      //   }
      // ])
    }
    if (this.route.snapshot.queryParams.vencimiento_start && this.route.snapshot.queryParams.vencimiento_end) {
      let value = { start: new Date(`${this.route.snapshot.queryParams.vencimiento_start} 00:00`), end: new Date(`${this.route.snapshot.queryParams.vencimiento_end} 00:00`) }
      this.rangeVencimiento.setValue(value)
    }
    
    if (this.route.snapshot.queryParams.cliente) this.cliente = await this._usuarioService.getUsuarioPorId(this.route.snapshot.queryParams.cliente) 
    // if (this.route.snapshot.queryParams.servicio) this.cliente = await this._usuarioService.getUsuarioPorId(this.route.snapshot.queryParams.cliente) 

    this.route.snapshot.queryParams.estado ? null : this.cambiarQueryParams([{ estado: 'PENDIENTES' }])
    this.estadoSeleccionado = this.route.snapshot.queryParams?.estado || 'PENDIENTES'

    this.filtrar(null, '0');
    this.observableBuscadores()

    this.servicios = await this._productoService.getProductos();
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '');
  }

  async filtrar(condicion?, total?) {

    if (condicion === 'fecha_vencimiento') {
      console.log("returning");

      if (!this.rangeVencimiento.value.end) return
    }
    if (condicion === 'fecha_pago') {
      console.log("returning");

      if (!this.rangePagado.value.end) return
    }
    this.facturas = null;
    this.montoTotal = null

    let pagado: boolean;
    if (this.estadoSeleccionado == 'PAGADOS') {
      pagado = true;
    } else if (this.estadoSeleccionado == 'PENDIENTES') {
      pagado = false;
    }

    this.opciones = {
      get_total: total || '1',
      titular: this.cliente ? this.cliente._id : null,
      utilizado: this.utilizado ? this.utilizado : null,
      de_baja: this.de_baja,
      vendedor: this.vendedor ? this.vendedor._id : null,
      cobrador: this.cobrador ? this.cobrador._id : null,
      servicio: this.servicio ? this.servicio._id : null,
      fondo: this.fondo ? this.fondo._id : null,
      contrato: this.contrato ? this.contrato._id : null,
      pagado,
      codigo_producto: this.codSeleccionado ? this.codSeleccionado : null,
      vencimiento_start: this.rangeVencimiento.value.start ? new Date(this.rangeVencimiento.value.start).getTime() : null,
      vencimiento_end: this.rangeVencimiento.value.end ? new Date(this.rangeVencimiento.value.end).setHours(23, 59, 59, 59) : null,
      pagado_start: this.rangePagado.value.start ? new Date(this.rangePagado.value.start).getTime() : null,
      pagado_end: this.rangePagado.value.end ? new Date(this.rangePagado.value.end).setHours(23, 59, 59, 59) : null,
      start: this.rangeEmision.value.start ? new Date(this.rangeEmision.value.start).getTime() : null,
      end: this.rangeEmision.value.end ? new Date(this.rangeEmision.value.end).setHours(23, 59, 59, 59) : null
    };

    const respF = await this._facturaService.getFacturasOptions(this.opciones, this.sort);
    this.count = respF.count;
    this.facturas = respF.facturas;
    this.montoTotal = respF.montoTotal

  }

  seleccionarProducto(producto: Producto) {

    this.servicio = producto;

  }

  async searchClientes(val) {
    if (val.term.length > 0) {
      this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', val.term);
    }
  }

  async searchcobradores(val) {
    if (val.term.length > 0) {
      this.cobradores = await this._usuarioService.buscarUsuarios('COBRADORES', val.term);

    }
  }
  async searchFondos(val) {
    if (val.term.length > 0) {
      this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);

    }
  }
  async searchvendedores(val) {
    if (val.term.length > 0) {
      this.vendedores = await this._usuarioService.buscarUsuarios('VENDEDORES', val.term);

    }
  }
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.NOMBRES.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS.toLowerCase().includes(term) ||
      item.RAZON.toLowerCase().includes(term) ||
      item.RUC.toLowerCase().includes(term);
  }

  async onSelectClient(cliente) {
    this.contratos = await this._contratoSerivce.getContratosByTitular(cliente._id);
    console.log(this.contratos);
    this.filtrar();

  }

  onContratoSelected(contrato) {
    this.contrato = contrato;
    console.log(contrato);
    this.filtrar();
  }


  async getFacturasApagar(id, monto) {
    if (monto < 1) {
      return;
    }
    this.facturasAPagar = await this._facturaService.pagarPorMonto({ contrato: id, monto });
  }

  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }
  async confirmarPago(id, monto, fondo) {
    await this._facturaService.pagarPorMonto({ contrato: id, monto, confirmado: true, fondo: fondo._id });
    this.ngOnInit();
    this.facturasAPagar = null;
  }



  prueba() {

    this.notifier.notify('success', 'pasa la edad');
  }

  observableBuscadores() {
    this.inputClientes.pipe(

      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingClientes = true;
        this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', txt);
        this.loadingClientes = false;
      });

    this.inputCobradores.pipe(
      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingCobradores = true;
        this.cobradores = await this._usuarioService.buscarUsuarios('COBRADORES', txt);
        this.loadingCobradores = false;
      });

    this.inputVendedores.pipe(
      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingVendedores = true;
        this.vendedores = await this._usuarioService.buscarUsuarios('VENDEDORES', txt);
        this.loadingVendedores = false;
      });
  }


  async aplicarInteres(monto) {
    await this._facturaService.aplicarInteres(this.opciones, monto)
  }

  async setUsuarioCobrador(id) {
    this.cobrador = await this._usuarioService.getUsuarioPorId(id)
    this.opciones.cobrador = id
  }

  generarReporte() {
    let body = {
      pagado: true,
      fecha_pagado_unix: {
        $gte: new Date(`${new Date(this.rangeReporte.value.start).toLocaleDateString('en-US')} 00:00`).getTime(),
        $lte: new Date(`${new Date(this.rangeReporte.value.end).toLocaleDateString('en-US')} 23:59:59`).getTime()
      },
      con_error: false
    }
    this._facturaService.getReporteIngresos(body)
  }

}
