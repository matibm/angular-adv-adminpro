import { io } from 'socket.io-client/build/index';
import { Router } from '@angular/router';
import { Factura } from './../../models/factura';
import { FacturaService } from './../../services/factura.service';
import { ContratoService } from './../../services/contrato.service';
import { Contrato } from './../../models/contrato';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css'],
})
export class FacturasComponent implements OnInit {
  constructor(
    public _facturaService: FacturaService,
    protected router: Router
  ) { }
  todos;
  page = 1;
  @Input() fromOutside = false;
  @Input() facturas: Factura[];
  @Input() count = 0;
  @Input() pagado;
  @Input() fondo;
  @Input() start;
  @Input() end;
  @Input() cerrado;
  @Input() showlabel = true;
  @Input() selectable = false;
  @Input() options: any;
  @Input() showTotal: any = false;
  @Input() total: any = false;
  @Output() listItemsEvent = new EventEmitter();
  @Output() AllSelectedEvent = new EventEmitter();
  listItems = [];
  selectAll = false;
  async ngOnInit() {
    // if (!this.facturas && !this.fromOutside) {
    //   let resp = await this._facturaService.getFacturas(this.pagado, this.fondo, this.start, this.end, null, null, this.cerrado)
    //   this.facturas = resp.facturas
    //   this.count = resp.count
    // } else {
    // }
  }
  @Input() sort = {
    key: 'vencimiento', value: 1
  }
  async pageChanged(page) {
    this.facturas = null
    let options: any = {};
    if (this.pagado == true) {
      options.pagado = this.pagado;
    } else if (this.pagado == false) {
      options.pagado = this.pagado;
    }
    if (this.cerrado == true) {
      options.cerrado = this.cerrado;
    } else if (this.cerrado == false) {
      options.cerrado = this.cerrado;
    }

    this.fondo ? (options.fondo = this.fondo) : '';
    this.start ? (options.start = this.start) : '';
    this.end ? (options.end = this.end) : '';
    this.end ? (options.end = this.end) : '';
    this.options ? (options = this.options) : '';
    options.page = page;
    // let resp = await this._facturaService.getFacturas(this.pagado, this.fondo, this.start, this.end, page, null, this.cerrado)
    this.options = options;
    const resp = await this._facturaService.getFacturasOptions(options, this.sort);

    this.facturas = resp.facturas;
    this.count = resp.count;
    console.log(page);
    setTimeout(() => {
      this.setSelected();
    }, 3);
  }

  selectItem(id) {
    if (this.selectable) {
      const item = document.getElementById(`id-${id}`);
      if (item.classList.contains('table-info')) {
        item.classList.remove('table-info');
        this.selectAll = false;
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
    } else {
      this.router.navigateByUrl(`/admin/ingreso/${id}`);
    }

    this.listItemsEvent.emit(this.listItems);
  }

  selectToAll() {
    console.log(this.selectAll);

    if (this.selectAll) {
      const rows = document.getElementsByClassName('item-table');
      for (let i = 0; i < rows.length; i++) {
        const doc = rows[i];
        doc.classList.remove('table-info');
      }
      this.selectAll = false;
    } else {
      this.selectAll = true;
      const rows = document.getElementsByClassName('item-table');
      for (let i = 0; i < rows.length; i++) {
        const doc = rows[i];
        doc.classList.add('table-info');
      }
    }
    this.AllSelectedEvent.emit(this.selectAll);
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

  async descargarExtracto() {

    localStorage.setItem('options_extracto', JSON.stringify(this.options))
    const wopen = window.open('/extracto-cuotas');
    // wopen.onafterprint = (event) => {
    //   wopen.close();
    // };
  }
  loadingDescargarExtracto = false
  async descargarExtractoExcel() {
    this.loadingDescargarExtracto = true
   await this._facturaService.getExtractoExcel(this.options, this.sort)
   this.loadingDescargarExtracto = false

  }

  
  async ordenar(key){
    this.facturas = null
    this.sort.key = key
    if (this.sort.value === 1) {
      this.sort.value = -1
    } else{
      this.sort.value = 1
    }
    const resp = await this._facturaService.getFacturasOptions(this.options, this.sort);

    this.facturas = resp.facturas;
  }
}
