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
    notifier: NotifierService

  ) {

    this.notifier = notifier;
  }

  private notifier: NotifierService;

  showModal = false;
  opciones;
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
  estadoSeleccionado = 'TODOS';

  rangeEmision = new FormGroup({
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


  async ngOnInit() {
    this.observableBuscadores()
    const respF = await this._facturaService.getFacturasOptions(this.opciones);
    this.count = respF.count;
    this.facturas = respF.facturas;
    this.servicios = await this._productoService.getProductos();
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '');
  }

  async filtrar() {
    let pagado: boolean;
    if (this.estadoSeleccionado == 'PAGADOS') {
      pagado = true;
    } else if (this.estadoSeleccionado == 'PENDIENTES') {
      pagado = false;
    }

    this.opciones = {
      titular: this.cliente ? this.cliente._id : null,
      vendedor: this.vendedor ? this.vendedor._id : null,
      cobrador: this.cobrador ? this.cobrador._id : null,
      servicio: this.servicio ? this.servicio._id : null,
      fondo: this.fondo ? this.fondo._id : null,
      contrato: this.contrato ? this.contrato._id : null,
      pagado,
      vencimiento_start: this.rangeVencimiento.value.start ? new Date(this.rangeVencimiento.value.start).getTime() : null,
      vencimiento_end: this.rangeVencimiento.value.end ? new Date(this.rangeVencimiento.value.end).setHours(23, 59, 59, 59) : null,
      pagado_start: this.rangePagado.value.start ? new Date(this.rangePagado.value.start).getTime() : null,
      pagado_end: this.rangePagado.value.end ? new Date(this.rangePagado.value.end).setHours(23, 59, 59, 59) : null,
      start: this.rangeEmision.value.start ? new Date(this.rangeEmision.value.start).getTime() : null,
      end: this.rangeEmision.value.end ? new Date(this.rangeEmision.value.end).setHours(23, 59, 59, 59) : null
    };

    const respF = await this._facturaService.getFacturasOptions(this.opciones);
    this.count = respF.count;
    this.facturas = respF.facturas;
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


}
