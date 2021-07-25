import { CajaService } from './../../services/caja.service';
import { UsuarioService } from './../../services/usuario.service';
import { FacturaService } from './../../services/factura.service';
import { MovimientoService } from './../../services/movimiento.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-info-caja',
  templateUrl: './info-caja.component.html',
  styleUrls: ['./info-caja.component.css'],
})
export class InfoCajaComponent implements OnInit {
  constructor(
    public _movimientoService: MovimientoService,
    public _facturaService: FacturaService,
    public _usuarioService: UsuarioService,
    public _cajaService: CajaService
  ) { }
  movimientosPrueba;
  movimientos;
  totalEgreso = 0;
  fondo;
  estado = 'PENDIENTES'
  fondos;
  totalMovimientos;
  totalIngreso = 0;
  ngmodelstart;
  listItems = [];
  listaMovimientos = [];
  ngmodelend;
  isAllSelectedIngresos = false;
  isAllSelectedMovimientos = false;
  public loading = false;
  // start = new Date(new Date().getTime() - (86400000 * 1)).getTime()
  end = new Date().getTime();
  start = 0;
  tableColor = 'inverse';
  iconTableColor = 'moon-o';
  itemTableColor = 'inverse';
  facturaCount = 0;
  movimientoCount = 0;
  facturas;
  cantidadIngreso = 0;
  cantidadEgreso = 0;
  cantidadTotal = 0;
  montoIngreso = 0;
  montoEgreso = 0;
  montoTotal = 0;
  saldoFondo = 0
  rangeFecha = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  count
  isAllSelected
  showModalBilletes = false
  TotalArqueo = 0
  options: any = { cerrado: false }
  async ngOnInit() {
    this.fondo = null;
    const resp = await this._movimientoService.getCajaBancos(1, this.options);
     this.cargarValores(resp)

    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '');
    this.loading = false;
  }


  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }

  async filtrarPorEstado(estado) {
    this.options.cerrado = estado === 'CONCILIADOS' ? true : false
    if (estado === 'TODOS') delete this.options.cerrado
    if (!estado) delete this.options.cerrado
    this.page = 1
    const resp = await this._movimientoService.getCajaBancos(this.page, this.options);
    this.cargarValores(resp)
  }

  async seleccionarFondo(fondo) {
    if (!fondo) {

      delete this.options.fondo
      console.log(this.options);

      const resp = await this._movimientoService.getCajaBancos(1, this.options);
      this.cargarValores(resp)
      return;
    }
    this.loading = true;
    // this.movimientosPrueba = await this._movimientoService.allmovimientosCaja(
    this.options.fondo = fondo._id
    const resp = await this._movimientoService.getCajaBancos(1, this.options);
    this.cargarValores(resp)

    const respMovimientos = await this._movimientoService.getAllMovimientos({
      cerrado: false,
      fondo: fondo._id,
    });
    this.movimientoCount = respMovimientos.count;
    this.movimientos = respMovimientos.movimientos;

    this.totalMovimientos = respMovimientos.total.monto_total;
    let respFondo: any = await this._movimientoService.getSaldoFondo(fondo._id)
    console.log(respFondo);

    this.saldoFondo = respFondo.data[0].ingreso - respFondo.data[0].gasto
    // const respfactura = await this._facturaService.getFacturas(
    //   true,
    //   fondo._id,
    //   this.start,
    //   this.end,
    //   null,
    //   null,
    //   false
    // );

    let options = {
      pagado: true,
      start: this.start,
      end: this.end,
      fondo: this.fondo._id,
      cerrado: false,
      get_total: '1'
    }
    // const respfactura = await this._facturaService.getFacturasOptions(options);

    // if (respfactura.ok) {
    //   this.facturas = respfactura.facturas;
    //   this.totalFacturas = respfactura.monto_total.total;
    //   this.facturaCount = respfactura.monto_total.count;
    // }
    this.loading = false;
    this.listItems = [];
    this.calcularSeleccionados();
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

  calcularFecha(isstart: boolean, date) {
    const d = new Date(date);
    d.setUTCHours(5);

    if (Object.prototype.toString.call(d) === '[object Date]') {
      // it is a date
      if (isNaN(d.getTime())) {
        // d.valueOf() could also work
        // date is not valid
      } else {
        // date is valid

        if (isstart == true) {
          d.setHours(0);
          this.start = d.getTime();
          this.start;
          console.log(d);
        } else {
          d.setHours(23, 59, 59);
          this.end = d.getTime();

          console.log(d);
        }
      }
    } else {
      // not a date
    }
  }

  async cerrarCaja() {
    const options: any = {};
    this.fondo ? (options.fondo = this.fondo._id) : null;
    let listas = this.listItems;
    console.log(listas);

    const body = {
      isAllSelected: this.isAllSelected,

      listItems: this.listItems || [],

    };
    await this._cajaService.cerrarCajaOptions(body, options);
    this.ngOnInit()

  }

  selectItem(movimiento) {
    let id = movimiento._id;
    const item = document.getElementById(`id-${id}`);
    if (item.classList.contains(`table-${this.itemTableColor}`)) {
      item.classList.remove(`table-${this.itemTableColor}`);
      for (let i = 0; i < this.listItems.length; i++) {
        const element = this.listItems[i];
        if (element._id == id) {
          this.listItems.splice(i, 1);
        }
      }
    } else {
      this.listItems.push(movimiento);
      item.classList.add(`table-${this.itemTableColor}`);
    }
    this.calcularSeleccionados();
  }

  switchTableColor() {
    let allItems = document.getElementById('the_body').childNodes;

    if (this.tableColor === 'inverse') {
      for (let i = 0; i < allItems.length; i++) {
        const element: any = allItems[i];
        if (element.classList?.contains('table-inverse')) {
          element.classList?.remove('table-inverse');
          element.classList?.add('table-secondary');
        }
      }
      this.tableColor = 'muted';
      this.itemTableColor = 'secondary';
      this.iconTableColor = 'sun-o';
    } else {
      for (let i = 0; i < allItems.length; i++) {
        const element: any = allItems[i];
        if (element.classList?.contains('table-secondary')) {
          element.classList?.remove('table-secondary');
          element.classList?.add('table-inverse');
        }
      }
      this.tableColor = 'inverse';
      this.itemTableColor = 'inverse';
      this.iconTableColor = 'moon-o';
    }
  }

  calcularSeleccionados() {
    this.cantidadIngreso = 0;
    this.cantidadEgreso = 0;
    this.cantidadTotal = 0;
    this.montoIngreso = 0;
    this.montoEgreso = 0;
    this.montoTotal = 0;
    for (let i = 0; i < this.listItems.length; i++) {
      const item = this.listItems[i];
      if (item.tipo == 'INGRESO') {
        this.cantidadIngreso++;
        this.montoIngreso += item.monto;
      }
      if (item.tipo == 'EGRESO') {
        this.cantidadEgreso++;
        this.montoEgreso += item.monto;
      }
    }
    this.montoTotal = this.montoIngreso + this.montoEgreso;
    this.cantidadTotal = this.cantidadIngreso + this.cantidadEgreso;
  }

  crearListasSeparadas(listaItems: Array<any>) {
    let listaIngresos = [];
    let listaEgresos = [];
    for (let index = 0; index < listaItems.length; index++) {
      const element = listaItems[index];
      if (element.haber) {
        listaIngresos.push(element._id);
      } else if (element.monto_total) {
        listaEgresos.push(element._id);
      }
    }
    return { listaIngresos, listaEgresos };
  }

  async filtroPorFecha() {
    this.options.date_start = this.rangeFecha.value.start ? new Date(this.rangeFecha.value.start).getTime() : null
    this.options.date_end = this.rangeFecha.value.end ? new Date(this.rangeFecha.value.end).setHours(23, 59, 59, 59) : null
    const resp = await this._movimientoService.getCajaBancos(1, this.options);
    this.cargarValores(resp)
  }

  page = 1
  async pageChanged(page) {

    this.page = page
    const resp = await this._movimientoService.getCajaBancos(this.page, this.options);
    this.cargarValores(resp)
  }

  cargarValores(data){
    this.movimientosPrueba = data.movimientos
    this.count = data.count
    this.TotalArqueo = data.totalEgreso + data.totalIngreso 
    this.totalEgreso = data.totalEgreso
    this.totalIngreso = data.totalIngreso
  }
}
