import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovimientoService } from 'src/app/services/movimiento.service';

@Component({
  selector: 'app-gasto',
  templateUrl: './gasto.component.html',
  styleUrls: ['./gasto.component.css']
})
export class GastoComponent implements OnInit {

  constructor(
    public _movimientoService: MovimientoService,
    public activatedRoute: ActivatedRoute
  ) { }
  id
  movimiento
  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    this.movimiento = await this._movimientoService.getMovimientoById(this.id)
    console.log(this.movimiento);    
  }

eliminar(){
  this._movimientoService.eliminarGasto(this.id)
}

}
