import { Producto } from './../../models/producto';
import { ProductosService } from './../../services/productos.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css']
})
export class ListaProductosComponent implements OnInit {

  constructor(
    public _productoService: ProductosService
  ) { }

  productos: Producto[];
  async ngOnInit() {
    this.productos = await this._productoService.getProductos();
  }

}
