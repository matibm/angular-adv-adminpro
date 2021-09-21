import { Movimiento } from './../../models/movimiento';
import { Component, Input, OnInit } from '@angular/core';
import { MovimientoOptions } from 'src/app/models/interfaces/MovimientoOptions';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lista-movimientos',
  templateUrl: './lista-movimientos.component.html',
  styleUrls: ['./lista-movimientos.component.css']
})
export class ListaMovimientosComponent implements OnInit {

  constructor(
    private _movimientoService: MovimientoService,
    public _usuarioService: UsuarioService,

  ) { }

  @Input() options: MovimientoOptions;
  @Input() movimientos: Movimiento[];
  @Input() showTitle = true;
  @Input() count;
  @Input() page = 1;
  proveedor
  cliente
  contrato
  showModal

  inputProveedores = new Subject<string>();
  inputClientes = new Subject<string>();
  loadingProveedores
  proveedores
  loadingClientes
  clientes
  fondo
  fondos
  nro_factura
  rangeFecha = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  async ngOnInit() {
    this.searchBancos('')
    this.observableBuscadores()
    if (this.options) {
      let resp = await this._movimientoService.getAllMovimientos(this.options)
      this.movimientos = resp.movimientos
      this.count = resp.count
    }
  }

  async pageChanged(page) {
    if (this.options) {
      this.options.page = page
      let resp = await this._movimientoService.getAllMovimientos(this.options)
      this.movimientos = resp.movimientos
      this.count = resp.count
    }
  }
  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }
  async seleccionarFondo(fondoId) {
    if (!fondoId) {
      delete this.options.fondo
      this.buscar()

      return
    }
    this.options.fondo = fondoId
    this.buscar()
    this.fondo = await this._usuarioService.getUsuarioPorId(fondoId)
  }
  async filtroPorFecha() {
    if (this.rangeFecha.value.end) {
      this.options.fecha_inicio = new Date(this.rangeFecha.value.start).getTime()
      this.options.fecha_fin = new Date(this.rangeFecha.value.end).setHours(23, 59, 59, 59)
      this.buscar()
    }

  }
  observableBuscadores() {

    this.inputProveedores.pipe(

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
    this.inputClientes.pipe(debounceTime(200), distinctUntilChanged()).subscribe(async (txt) => {
      if (!txt) {
        return;
      }
      this.loadingClientes = true;
      this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', txt);
      this.loadingClientes = false;
    });


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
  async buscar() {
    this.nro_factura ? this.options.nro_factura = this.nro_factura : delete this.options.nro_factura
    this.cliente ? this.options.cliente = this.cliente._id : null
    this.proveedor ? this.options.proveedor = this.proveedor._id : null
    this.contrato ? this.options.contrato = this.contrato._id : null;
    const resp = await this._movimientoService.getAllMovimientos(this.options)
    this.movimientos = resp.movimientos
    this.count = resp.count
    this.page = 1
  }

}
