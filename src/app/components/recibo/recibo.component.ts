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
  ngOnInit(): void {
    this.reciboPagado = localStorage.getItem('recibo') ? JSON.parse(localStorage.getItem('recibo')) : {}
    this.cliente = localStorage.getItem('recibo-cliente') ? JSON.parse(localStorage.getItem('recibo-cliente')) : {}
    setTimeout(() => {
      window.print();
    }, 500);
  }

}
