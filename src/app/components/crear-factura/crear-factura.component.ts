import { Router } from '@angular/router';
import { FacturaService } from './../../services/factura.service';
import { UsuarioService } from './../../services/usuario.service';
import { Producto } from './../../models/producto';
import { ProductosService } from 'src/app/services/productos.service';
import { Component, OnInit } from '@angular/core';
import { Contrato } from 'src/app/models/contrato';

@Component({
  selector: 'app-crear-factura',
  templateUrl: './crear-factura.component.html',
  styleUrls: ['./crear-factura.component.css']
})
export class CrearFacturaComponent implements OnInit {

  constructor(
    public _productoService: ProductosService,
    public _usuarioService: UsuarioService,
    public _facturaService: FacturaService,
    public route: Router
  ) { }
  servicio: Producto;
  nota
  servicios;
  cliente;
  clientes;
  cobrador;
  cobradores;
  vendedor;
  vendedores;
  vencimiento;
  vencimientoString;
  contrato: Contrato;
  showModal = false
  fecha_vencimiento = new Date()
  async ngOnInit() {

    this.servicios = await this._productoService.getProductos();

  }
  async searchClientes(val) {
    if (val.term.length > 0) {
      this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', val.term);
      console.log(this.clientes);

    }
  }
  async searchCobradores(val) {
    if (val.term.length > 0) {
      this.cobradores = await this._usuarioService.buscarUsuarios('COBRADORES', val.term);
      console.log(this.cobradores);

    }
  }
  async searchVendedores(val) {
    if (val.term.length > 0) {
      this.vendedores = await this._usuarioService.buscarUsuarios('VENDEDORES', val.term);

    }
  }

  customSearchFn(term: string, item: any) {
    if (term) {
      term = term.toLowerCase();

      return item.NOMBRES?.toLowerCase().indexOf(term) > -1 ||
        item.APELLIDOS?.toLowerCase().includes(term) ||
        item.RAZON?.toLowerCase().includes(term) ||
        item.RUC?.toLowerCase().includes(term);
    }
  }
  yasecreo= false
  async crearFactura() {
    if (!this.yasecreo) {
      this.yasecreo = true
      const body = {
        monto: this.servicio?.PRECIO_MAYORISTA,
        nota: this.nota,
        titular: this.cliente?._id || '',
        servicio: this.servicio?._id || '',
        producto : this.servicio,
        cobrador: this.cobrador?._id || '',
        contrato: this.contrato?._id,
        vendedor: this.vendedor?._id || '',
        nro_factura: 0,
        nro_contrato: this.contrato?.nro_contrato,
        vencimiento: new Date(`${this.fecha_vencimiento.getFullYear()}-${this.fecha_vencimiento.getMonth()+1}-${this.fecha_vencimiento.getDate()} 00:00:00`).getTime()
      };
      const factura = await this._facturaService.crearFactura(body);
      this.yasecreo = false
      this.route.navigateByUrl(`/admin/ingreso/${factura._id}`);  
    }
    
  }

  calcularFecha(stringDate) {

    const d = new Date(stringDate);
    d.setUTCHours(5);

    if (Object.prototype.toString.call(d) === '[object Date]') {
      // it is a date
      if (isNaN(d.getTime())) {  // d.valueOf() could also work
        // date is not valid
      } else {
        // date is valid
        return d.getTime();

      }
    } else {
      // not a date
    }
  }


}
