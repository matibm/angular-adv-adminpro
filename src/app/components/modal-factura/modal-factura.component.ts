import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-modal-factura',
  templateUrl: './modal-factura.component.html',
  styleUrls: ['./modal-factura.component.css']
})
export class ModalFacturaComponent implements OnInit {

  constructor(private _facturaService: FacturaService) { }
  @Output() onClose = new EventEmitter();
  @Input() facturaPDF;
  @Input() existe;
  loadingCancelarPago = false
  loadingFE = false
  style: any = {};
  facturaStatus = ''

  async ngOnInit(){
    const height = window.screen.availHeight;

    this.style.maxHeight = (height - 340) + 'px';
    this.style.overflow = 'auto';
    console.log(this.facturaPDF);
    this.facturaPDF = {... await this.facturaPDF}
    console.log(this.style);
    this.facturaStatus = await this.estadoFactura(this.facturaPDF._id)
    console.log();

  }

  print(event){
     if (event.target.id == 'afuera') {
      this.onClose.emit();
    }
  }


  printTicket() {
    const wopen = window.open(`/factura-ticket/${this.facturaPDF._id}`);
    // wopen.onafterprint = (event) => {
    //   wopen.close();
    // };
  }
  printContrato() {
    const wopen = window.open('/factura-pdf/' + this.facturaPDF._id);
    // wopen.onafterprint = (event) => {
    //   wopen.close();
    // };
  }

  async cancelarPago(){
    this.loadingCancelarPago = true
    console.log(this.facturaPDF);

    await this._facturaService.cancelarPago(this.facturaPDF._id)
    this.onClose.emit()
    this.loadingCancelarPago = false
  }

  async facturaElectronica(){
    this.loadingFE = true
    console.log(this.facturaPDF);
    await this._facturaService.descargarArchivoPDF(this.facturaPDF._id)
    this.onClose.emit()
    this.loadingFE = false
  }

  async KUDETicket(){
    this.loadingFE = true
    console.log(this.facturaPDF);

    const resp = await this._facturaService.getTicketKUDE(this.facturaPDF._id)
    console.log(resp);
    window.open(`/factura-ticket-kude/${this.facturaPDF._id}`);
    // this.onClose.emit()
    this.loadingFE = false
  }



  loadingNotaCredito = false
  async notaCredito(){
    this.loadingNotaCredito = true

    await this._facturaService.descargarNotaCreditoPDF(this.facturaPDF._id)
    this.onClose.emit()
    if (this.facturaStatus == 'factura') {
      this.cancelarPago()
    }
    this.loadingNotaCredito = false
  }

  async estadoFactura(pago_id: string): Promise<any> {
    const resp = await this._facturaService.estadoFactura(pago_id)
    return resp
  }

}
