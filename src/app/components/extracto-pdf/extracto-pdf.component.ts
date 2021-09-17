import { FacturaService } from './../../services/factura.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extracto-pdf',
  templateUrl: './extracto-pdf.component.html',
  styleUrls: ['./extracto-pdf.component.css'],
})
export class ExtractoPdfComponent implements OnInit {
  constructor(public _facturaService: FacturaService) {}
  titular 
  contrato
  facturas;
  // @Input() options = {};
  async ngOnInit() {
    let options: any = localStorage.getItem('options_extracto')
      ? JSON.parse(localStorage.getItem('options_extracto'))
      : {};
    options.isExtracto = true;
    
    let resp = await this._facturaService.getFacturasOptions(options, {key:'vencimiento', value: 1});
    console.log(resp);
     
    this.facturas = resp.facturas;
    setTimeout(() => {
      window.print();
    }, 500);

    // window.onafterprint = (event) => {
    //   window.close();
    // };
  }
}
