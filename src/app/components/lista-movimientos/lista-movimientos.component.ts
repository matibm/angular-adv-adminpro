import { Movimiento } from './../../models/movimiento';
import { Component, Input, OnInit } from '@angular/core';
import { MovimientoOptions } from 'src/app/models/interfaces/MovimientoOptions';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsuarioService } from 'src/app/services/usuario.service';

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
  async ngOnInit() {
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
  inputProveedores = new Subject<string>();
  inputClientes = new Subject<string>();
  loadingProveedores
  proveedores
  loadingClientes
  clientes
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
    this.cliente? this.options.cliente = this.cliente._id : ''
    this.proveedor? this.options.proveedor = this.proveedor._id : ''
    this.contrato? this.options.contrato = this.contrato._id : ''
    const resp = await this._movimientoService.getAllMovimientos(this.options)
    this.movimientos = resp.movimientos
    this.count = resp.count 
    this.page =1
  }

}
