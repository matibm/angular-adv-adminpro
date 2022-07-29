import { FacturaService } from './../../services/factura.service';
import { UsuarioService } from './../../services/usuario.service';
import { Usuario } from './../../models/usuario';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { Movimiento } from 'src/app/models/movimiento';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.css']
})
export class TransferenciaComponent implements OnInit, AfterViewInit {

  constructor(
    public _usuarioService: UsuarioService,
    public _facturaService: FacturaService,
    public _movimientoService: MovimientoService,

  ) { }
  @ViewChild('search', { static: false }) searchOrigen;
  ngAfterViewInit(){
    this.searchOrigen.focus()
  }
  fondoOrigen: Usuario;
  fondoDestino: Usuario;
  fondos: Usuario[];
  facturas;
  facturaCount = 0;
  facturaPage = 1;
  listItems = [];
  saldoDisponible = 0
  montoATransferir = 0
  comentario = ''
  nro_factura = ''
  fecha_creacion = new Date()
  async ngOnInit() {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '');

  }
  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.NOMBRES.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS.toLowerCase().includes(term) ||
      item.RAZON.toLowerCase().includes(term) ||
      item.RUC.toLowerCase().includes(term);
  }

  selectFondoOrigen(value) {
    this.getSaldoDeFondo(value._id);
  }

  async getSaldoDeFondo(fondo) {
    const options = {
      fondo
    }
    const resp = await this._movimientoService.getCajaBancos(1, options);
    console.log(resp);
    this.saldoDisponible = resp.movimientos[0]?.total || 0

  }

  async realizarTransferencia() {
    let movimientoOrigen: Movimiento = {
      fondo: this.fondoOrigen,
      comentario: this.comentario,
      fecha_creacion_unix: this.fecha_creacion.getTime(),
      nro_factura: this.nro_factura,
      nro_comp_banco: this.nro_factura,
      nombre: 'TRANSFERENCIA',
      es_transferencia: true,
      anulado: '0',
      monto_total: this.montoATransferir
    }

    let origen = await this._movimientoService.crearMovimiento(movimientoOrigen)

    let movimientoDestino: Movimiento = {
      fondo: this.fondoDestino,
      comentario: this.comentario,
      fecha_creacion_unix: this.fecha_creacion.getTime(),
      nro_factura: this.nro_factura,
      nro_comp_banco: this.nro_factura,
      nombre: 'TRANSFERENCIA',
      es_transferencia: true,
      anulado: '0',
      monto_total: this.montoATransferir * -1
    }

    let destino = await this._movimientoService.crearMovimiento(movimientoDestino)

    console.log(origen);
    console.log(destino);
    this.resetAll()
    window.location.reload()
  }


  // async getFacturas(fondoId) {


  //   const respf = await this._facturaService.getFacturasOptions({ fondo: fondoId, pagado: 'true' });
  //   console.log(respf);
  //   this.facturas = respf.facturas;
  //   this.facturaCount = respf.count;

  // }
  async pageChanged(page) {
    console.log(page);

    const resp = await this._facturaService.getFacturasOptions({ fondo: this.fondoOrigen._id, pagado: 'true', page });

    this.facturaPage = page;
    this.facturas = resp.facturas;
    this.facturaCount = resp.count;
    console.log(page);
    setTimeout(() => {
      this.setSelected();
    }, 1);
  }

  selectItem(id) {
    const item = document.getElementById(`id-${id}`);
    if (item.classList.contains('table-info')) {
      item.classList.remove('table-info');
      for (let i = 0; i < this.listItems.length; i++) {
        const element = this.listItems[i];
        if (element == id) {
          this.listItems.splice(i, 1);
        }
      }
    } else {
      this.listItems.push(id);
      item.classList.add('table-info');
    }
  }

  setSelected() {
    for (let i = 0; i < this.listItems.length; i++) {
      const item = this.listItems[i];
      console.log(item);

      const doc = document.getElementById(`id-${item}`);
      console.log(doc);

      if (doc) {
        doc.classList.add('table-info');

      }
    }

  }


  resetAll(){
    this.fondoOrigen = null 
    this.fondoDestino = null
    this.fondos = null
    this.facturas = null;
    this.saldoDisponible = 0
    this.montoATransferir = 0
    this.comentario = ''
    this.nro_factura = ''
    this.fecha_creacion = new Date()
  }
}
