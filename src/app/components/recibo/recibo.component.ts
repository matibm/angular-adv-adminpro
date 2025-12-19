import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.css']
})
export class ReciboComponent implements OnInit {

  constructor() { }

  reciboPagado: any = {}
  cliente: any = {}
  totalCalculado: number = 0

  ngOnInit(): void {
    this.reciboPagado = localStorage.getItem('recibo') ? JSON.parse(localStorage.getItem('recibo')) : {}
    this.cliente = localStorage.getItem('recibo-cliente') ? JSON.parse(localStorage.getItem('recibo-cliente')) : {}
    
    // Calcular el total sumando las facturas
    this.totalCalculado = 0
    if (this.reciboPagado.facturas && Array.isArray(this.reciboPagado.facturas)) {
      this.totalCalculado = this.reciboPagado.facturas.reduce((sum: number, factura: any) => {
        return sum + (factura.haber || 0)
      }, 0)
    }
    
    setTimeout(() => {
      window.print();
    }, 500);
  }

}
