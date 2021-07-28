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
  @Output() onSelectedCategory = new EventEmitter();
  dataSource = new MatTreeNestedDataSource<any>();
  treeControl = new NestedTreeControl<any>((node) => node.hijos);
  hasChild = (_: number, node: any) => !!node.hijos && node.hijos.length > 0;
  search;
  async ngOnInit() {
    this.dataSource.data = await this._movimientoService.getTipoMovimiento();
    console.log(this.dataSource.data);
    this.treeControl.expand(this.dataSource.data[0]);
    // this.treeControl.expandDescendants(this.dataSource.data[1]);
    Object.keys(this.dataSource.data).forEach((x) => {
      this.setParent(this.dataSource.data[x], null);
    });
  }

  setParent(data, parent) {
    data.parent = parent;
    if (data.hijos) {
      data.hijos.forEach((x) => {
        this.setParent(x, data);
      });
    }
  }

  print(event) {
    console.log(event.target);
    if (event.target.id == 'afuera') {
      this.onClose.emit();
    }
  }

  onclickitem(event) {
    console.log(event);
    this.onSelected.emit(event);
  }

  onclickCategory(event) {
    this.onSelectedCategory.emit(event);
  }

  setChildOk(text: string, node: any) {
    console.log(this.dataSource.data);
    
    node.forEach((x) => {
      x.ok = x.descripcion.indexOf(text.toUpperCase()) >= 0;
      if (x.parent) this.setParentOk(text, x.parent, x.ok);
      if (x.hijos) this.setChildOk(text, x.hijos);
    });
  }

  setParentOk(text, node, ok) {
    node.ok = ok || node.ok || node.descripcion.indexOf(text.toUpperCase()) >= 0;
    if (node.parent) this.setParentOk(text, node.parent, node.ok);
  }
}
