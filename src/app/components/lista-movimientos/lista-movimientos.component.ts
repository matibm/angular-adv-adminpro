import { Movimiento } from './../../models/movimiento';
import { Component, Input, OnInit } from '@angular/core';
import { MovimientoOptions } from 'src/app/models/interfaces/MovimientoOptions';
import { MovimientoService } from 'src/app/services/movimiento.service';

@Component({
  selector: 'app-lista-movimientos',
  templateUrl: './lista-movimientos.component.html',
  styleUrls: ['./lista-movimientos.component.css']
})
export class ListaMovimientosComponent implements OnInit {

  constructor(
    private _movimientoService: MovimientoService
  ) { }
 
  @Input() options: MovimientoOptions;
  @Input() movimientos: Movimiento[];
  @Input() showTitle = true;
  @Input() count ;
  @Input() page = 1;
  
  async ngOnInit() {
    if (this.options) {
      let resp = await this._movimientoService.getAllMovimientos(this.options)
      this.movimientos = resp.movimientos
      this.count = resp.count
    }
  }
 
 async pageChanged(page){
    if (this.options) {
      this.options.page = page
      let resp = await this._movimientoService.getAllMovimientos(this.options)
      this.movimientos = resp.movimientos
      this.count = resp.count
    }
  }
}
