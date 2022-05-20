import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';

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

  @ViewChildren('cienmilInput') cienmilInput: any;

  ngOnInit(): void {
    setTimeout(() => {
      this.cienmilInput.first.nativeElement.focus();

    }, 100);
  }
  cienmil = null
  cincuentamil = null
  veintemil = null
  diezmil = null
  cincomil = null
  dosmil = null
  mil = null
  quinientos = null
  cien = null
  cincuenta = null
  total = null
  cheque = null
  print(event) {
    console.log(event.target);
    if (event.target.id == 'afuera') {
      this.onClose.emit(null);
    }
  }




  sumaTotal() {
    this.total = 0
    if(this.cienmil) this.total += this.cienmil * 100000
    if(this.cincuentamil) this.total += this.cincuentamil * 50000
    if(this.veintemil) this.total += this.veintemil * 20000
    if(this.diezmil) this.total += this.diezmil * 10000
    if(this.cincomil) this.total += this.cincomil * 5000
    if(this.dosmil) this.total += this.dosmil * 2000
    if(this.mil) this.total += this.mil * 1000
    if(this.quinientos) this.total += this.quinientos * 500
    if(this.cien) this.total += this.cien * 100
    if(this.cincuenta) this.total += this.cincuenta * 50
    if(this.cheque) this.total += this.cheque

    return this.total
  }
}
