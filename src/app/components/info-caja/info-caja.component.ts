import { CajaService } from './../../services/caja.service';
import { UsuarioService } from './../../services/usuario.service';
import { FacturaService } from './../../services/factura.service';
import { MovimientoService } from './../../services/movimiento.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-caja',
  templateUrl: './info-caja.component.html',
  styleUrls: ['./info-caja.component.css']
})
export class InfoCajaComponent implements OnInit {

  constructor(
    public _movimientoService: MovimientoService,
    public _facturaService: FacturaService,
    public _usuarioService: UsuarioService,
    public _cajaService: CajaService

  ) { }
  movimientosPrueba
  movimientos;
  HaberMovimientos = 0;
  fondo;
  fondos;
  totalMovimientos;
  totalFacturas = 0;
  ngmodelstart;
  listItems = [];
  ngmodelend;
  isAllSelectedIngresos = false;
  isAllSelectedMovimientos = true;
  public loading = false;
  // start = new Date(new Date().getTime() - (86400000 * 1)).getTime()
  end = new Date().getTime();
  start = 0;


  facturaCount = 0;
  movimientoCount = 0;
  facturas;
  print() {
    console.log(this.listItems);

  }
  async ngOnInit() {
    this.loading = true;

    this.movimientosPrueba = await this._movimientoService.allmovimientosCaja()
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '');

    // let respMovimientos = await this._movimientoService.getMovimientosByDate(this.start, this.end, null, false)
    const respMovimientos = await this._movimientoService.getAllMovimientos({ cerrado: false });
    this.movimientoCount = respMovimientos.count;
    this.movimientos = respMovimientos.movimientos;

    this.totalMovimientos = respMovimientos.total.monto_total;
    this.HaberMovimientos = respMovimientos.total.monto_haber - respMovimientos.total.monto_total | 0;
    let respfactura;
    if (this.fondo) {

      respfactura = await this._facturaService.getFacturas(true, this.fondo._id, this.start, this.end, null, null, false);
    } else {
      respfactura = await this._facturaService.getFacturas(true, null, this.start, this.end, null, null, false);
    }
    if (respfactura.ok) {
      this.facturas = respfactura.facturas;
      this.totalFacturas = respfactura.total;
      this.facturaCount = respfactura.count;
    }

    console.log(this.facturas);
    this.loading = false;

  }
  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }

  async seleccionarFondo(fondo) {

    if (!fondo) {
      return;
    }
    this.loading = true;

    const respMovimientos = await this._movimientoService.getAllMovimientos({ cerrado: false, fondo: fondo._id });
    this.movimientoCount = respMovimientos.count;
    this.movimientos = respMovimientos.movimientos;

    this.totalMovimientos = respMovimientos.total.monto_total;
    this.HaberMovimientos = respMovimientos.total.monto_haber - respMovimientos.total.monto_total | 0;

    const respfactura = await this._facturaService.getFacturas(true, fondo._id, this.start, this.end, null, null, false);
    if (respfactura.ok) {
      this.facturas = respfactura.facturas;
      this.totalFacturas = respfactura.total;
      this.facturaCount = respfactura.count;
    }
    this.loading = false;

  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.NOMBRES.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS.toLowerCase().includes(term) ||
      item.RAZON.toLowerCase().includes(term) ||
      item.RUC.toLowerCase().includes(term);
  }

 
  calcularFecha(isstart: boolean, date) {

    const d = new Date(date);
    d.setUTCHours(5);

    if (Object.prototype.toString.call(d) === '[object Date]') {
      // it is a date
      if (isNaN(d.getTime())) {  // d.valueOf() could also work
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
    // await this._cajaService.cerrarCaja(this.start, this.end, this.fondo ? this.fondo._id : null)
    const options: any = {};
    this.fondo ? options.fondo = this.fondo._id : null;
    const body = {
      isAllSelectedIngresos: this.isAllSelectedIngresos,
      isAllSelectedMovimientos: this.isAllSelectedMovimientos,
      listItemsIngresos: this.listItems || [],
      listItemsMovimientos:  [] // esto hay que colocar bien
    };
    await this._cajaService.cerrarCajaOptions(body, options);
  }

}
