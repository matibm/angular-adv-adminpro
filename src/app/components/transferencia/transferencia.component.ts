import { FacturaService } from './../../services/factura.service';
import { UsuarioService } from './../../services/usuario.service';
import { Usuario } from './../../models/usuario';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.css']
})
export class TransferenciaComponent implements OnInit {

  constructor(
    public _usuarioService: UsuarioService,
    public _facturaService: FacturaService
  ) { }
  fondoOrigen: Usuario;
  fondoDestino: Usuario;
  fondos: Usuario[];
  facturas;
  facturaCount = 0;
  facturaPage = 1;
  listItems = [];
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
    this.getFacturas(value._id);
  }

  async getFacturas(fondoId) {


    const respf = await this._facturaService.getFacturasOptions({ fondo: fondoId, pagado: 'true' });
    console.log(respf);
    this.facturas = respf.facturas;
    this.facturaCount = respf.count;

  }
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

  setSelected(){
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

}
