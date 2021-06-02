import { Movimiento } from './../../models/movimiento';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-movimientos',
  templateUrl: './lista-movimientos.component.html',
  styleUrls: ['./lista-movimientos.component.css']
})
export class ListaMovimientosComponent implements OnInit {

  constructor() { }




  @Input() movimientos: Movimiento[];
  @Input() showTitle = true;

  ngOnInit(): void {
  }

}
