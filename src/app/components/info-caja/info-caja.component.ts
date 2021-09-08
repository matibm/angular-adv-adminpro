import { CajaService } from './../../services/caja.service';
import { UsuarioService } from './../../services/usuario.service';
import { FacturaService } from './../../services/factura.service';
import { MovimientoService } from './../../services/movimiento.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

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
    public _cajaService: CajaService,
    public route: ActivatedRoute,
    private router: Router

  ) { }
  movimientosPrueba;
  movimientos;
  totalEgreso = 0;
  fondo;
  estado = 'TODOS'
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
  options: any = {}
  async ngOnInit() {
    this.fondo = null;
    // const resp = await this._movimientoService.getCajaBancos(1, this.options);
    //  this.cargarValores(resp)
    if (!this.route.snapshot.queryParams.start && !this.route.snapshot.queryParams.end) {
      let month = new Date().getMonth() + 1
      let year = new Date().getFullYear()
      this.rangeFecha.setValue({ start: new Date(`${year}-${month}-01`), end: new Date() })
      this.cambiarQueryParams([
        {
          start: new Date(`${year}-${month}-01`).toLocaleDateString('fr-CA', { year: "numeric", month: "2-digit", day: "2-digit" })
        },
        {
          end: new Date().toLocaleDateString('fr-CA', { year: "numeric", month: "2-digit", day: "2-digit" })
        }
      ])
    }
    if (this.route.snapshot.queryParams.start && this.route.snapshot.queryParams.end) {
      let value = { start: new Date(`${this.route.snapshot.queryParams.start} 00:00`), end: new Date(`${this.route.snapshot.queryParams.end} 00:00`) }
      this.rangeFecha.setValue(value)
    }
    if (this.route.snapshot.queryParams.estado) {
      this.estado = 'TODOS'

      if (this.route.snapshot.queryParams.estado == 'PENDIENTES') {
        this.estado = this.route.snapshot.queryParams.estado
      }
      if (this.route.snapshot.queryParams.estado == 'CONCILIADOS') {
        this.estado = this.route.snapshot.queryParams.estado
      }
    }
    this.route.snapshot.queryParams.fondo ? await this.seleccionarFondo(this.route.snapshot.queryParams.fondo) : ''


    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '');
    this.loading = false;
  }



  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }
  fill = (number, len) => "0".repeat(len - number.toString().length) + number.toString();

  async filtrarPorEstado(estado) {
    this.loading = true
    this.movimientosPrueba = null
    this.cambiarQueryParams([{estado: estado}])
    this.options.cerrado = estado === 'CONCILIADOS' ? true : false
    if (estado === 'TODOS') delete this.options.cerrado
    if (!estado) delete this.options.cerrado
    this.page = 1
    const resp = await this._movimientoService.getCajaBancos(this.page, this.options);
    this.cargarValores(resp)
    this.loading = false

  }

  async seleccionarFondo(fondoId) {
    console.log(fondoId);

    if (!fondoId) {

      delete this.options.fondo
      console.log(this.options);

      // const resp = await this._movimientoService.getCajaBancos(1, this.options);
      // this.cargarValores(resp)
      return;
    }
    this.loading = true;

    this.fondo = await this._usuarioService.getUsuarioPorId(fondoId)
    this.options.cerrado = this.estado === 'CONCILIADOS' ? true : false
    if (this.estado === 'TODOS') delete this.options.cerrado
    if (!this.estado) delete this.options.cerrado
    // this.movimientosPrueba = await this._movimientoService.allmovimientosCaja(
    this.options.fondo = fondoId
    this.options.date_start = this.rangeFecha.value.start ? new Date(this.rangeFecha.value.start).getTime() : null
    this.options.date_end = this.rangeFecha.value.end ? new Date(this.rangeFecha.value.end).setHours(23, 59, 59, 59) : null
    this.cambiarQueryParams([{ fondo: this.fondo._id }])
    const resp = await this._movimientoService.getCajaBancos(1, this.options);
    this.cargarValores(resp)

    const respMovimientos = await this._movimientoService.getAllMovimientos({
      cerrado: false,
      fondo: fondoId,
    });
    this.movimientoCount = respMovimientos.count;
    this.movimientos = respMovimientos.movimientos;

    this.totalMovimientos = respMovimientos.total.monto_total;
    let respFondo: any = await this._movimientoService.getSaldoFondo(fondoId)
    console.log(respFondo);

    // this.saldoFondo = respFondo.data[0].ingreso - respFondo.data[0].gasto
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
      isAll: true,

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
    if (!this.rangeFecha.value.end) {
      console.log("vacio");
      return
    }
    this.loading = true
    this.movimientosPrueba = null
    this.options.date_start = this.rangeFecha.value.start ? new Date(this.rangeFecha.value.start).getTime() : null
    this.options.date_end = this.rangeFecha.value.end ? new Date(this.rangeFecha.value.end).setHours(23, 59, 59, 59) : null
    this.options.date_start ? this.cambiarQueryParams([
      {
        start: new Date(this.options.date_start).toLocaleDateString('fr-CA', { year: "numeric", month: "2-digit", day: "2-digit" })
      },
      {
        end: new Date(this.options.date_end).toLocaleDateString('fr-CA', { year: "numeric", month: "2-digit", day: "2-digit" })
      }
    ]) : null
    // this.options.date_end ? this.cambiarQueryParams('end', new Date(this.options.date_end).toLocaleDateString('fr-CA', { year: "numeric", month: "2-digit", day: "2-digit" })) : null
    const resp = await this._movimientoService.getCajaBancos(1, this.options);
    this.cargarValores(resp)
    this.loading = false

  }

  page = 1
  async pageChanged(page) {

    this.page = page
    const resp = await this._movimientoService.getCajaBancos(this.page, this.options);
    this.cargarValores(resp)
  }

  cambiarQueryParams(paths) {
    let queryParams: Params = { ... this.route.snapshot.queryParams }
    for (let i = 0; i < paths.length; i++) {
      const element = paths[i];
      Object.keys(element).forEach((key, index) => {
        queryParams[key] = element[key]

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
  cargarValores(data) {
    this.movimientosPrueba = data.movimientos
    this.count = data.count
    this.TotalArqueo = data.totalEgreso + data.totalIngreso
    this.totalEgreso = data.totalEgreso
    this.totalIngreso = data.totalIngreso
  }
}
