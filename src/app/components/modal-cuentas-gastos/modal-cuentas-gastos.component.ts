import { MovimientoService } from './../../services/movimiento.service';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-cuentas-gastos',
  templateUrl: './modal-cuentas-gastos.component.html',
  styleUrls: ['./modal-cuentas-gastos.component.css'],
})
export class ModalCuentasGastosComponent implements OnInit {
  constructor(public _movimientoService: MovimientoService) {}
  @Output() onClose = new EventEmitter();
  @Output() onSelected = new EventEmitter();
  dataSource = new MatTreeNestedDataSource<any>();
  treeControl = new NestedTreeControl<any>((node) => node.hijos);
  hasChild = (_: number, node: any) => !!node.hijos && node.hijos.length > 0;

  async ngOnInit() {
    this.dataSource.data = await this._movimientoService.getTipoMovimiento();
    console.log(this.treeControl);
    
  }

  print(event) {
    console.log(event.target);
    if (event.target.id == 'afuera') {
      this.onClose.emit();
    }
  }

  onclickitem(event){
    console.log(event);
    this.onSelected.emit(event)
  }
}
