import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-billetes',
  templateUrl: './modal-billetes.component.html',
  styleUrls: ['./modal-billetes.component.css']
})
export class ModalBilletesComponent implements OnInit {

  constructor() { }
  @Output() onClose = new EventEmitter();
  @Input() montoTotal = 0
  @Output() cerrarCaja = new EventEmitter();
  ngOnInit(): void {
  }
  cienmil = 0
  cincuentamil = 0
  veintemil = 0
  diezmil = 0
  cincomil = 0
  dosmil = 0
  mil = 0
  quinientos = 0
  cien = 0
  cincuenta = 0
  total = 0
  cheque = 0
  print(event) {
    console.log(event.target);
    if (event.target.id == 'afuera') {
      this.onClose.emit(null);
    }
  }




  sumaTotal() {
    this.total = 0
    this.total += this.cienmil * 100000
    this.total += this.cincuentamil * 50000
    this.total += this.veintemil * 20000
    this.total += this.diezmil * 10000
    this.total += this.cincomil * 5000
    this.total += this.dosmil * 2000
    this.total += this.mil * 1000
    this.total += this.quinientos * 500
    this.total += this.cien * 100
    this.total += this.cincuenta * 50
    this.total += this.cheque

    return this.total
  }
}
