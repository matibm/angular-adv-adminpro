import { Producto } from './../../models/producto';
import { ProductosService } from './../../services/productos.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    public _productoService: ProductosService
  ) { }
  id;
  producto: Producto;
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.producto = await this._productoService.getProductoById(this.id);
  }

  async guardarProducto(){
    this.producto.cantidad = this.producto.cantidad || 0
    await this._productoService.actualizarProducto(this.producto);
    window.history.back();
  }
  cancelar(){
    window.history.back();
  }

}
