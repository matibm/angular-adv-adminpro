import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pdf-factura-mobile',
  templateUrl: './pdf-factura-mobile.component.html',
  styleUrls: ['./pdf-factura-mobile.component.css']
})
export class PdfFacturaMobileComponent implements OnInit {

  constructor() { }
  @Input() facturapdf
  @Input() printAltoke
  @Input() existe
  
  @Output() onClose = new EventEmitter()
  ngOnInit(): void {
    // setTimeout(() => {
      window.print()
    // }, 300);
  }

}
