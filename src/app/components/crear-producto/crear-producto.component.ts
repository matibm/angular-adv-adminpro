import { Producto } from './../../models/producto';
import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {

  constructor(
    public _productoService: ProductosService
  ) { }

  ngOnInit(): void {
  }


  async crearProducto(nombre, cod, precio, codigo, cantidad) {
    const producto: Producto = {
      ID_PRODUCTO: codigo,
      NOMBRE: nombre,
      COD_CORTO: cod,
      PRECIO_MAYORISTA: precio,
      cantidad
    };
    await this._productoService.crearProducto(producto);
    window.history.back();
  }

  cancelar() {
    window.history.back();
  }

}
