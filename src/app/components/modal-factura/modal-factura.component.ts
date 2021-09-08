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
  style: any = {};
  ngOnInit(): void {
    const height = window.screen.availHeight;
 
    this.style.maxHeight = (height - 300) + 'px';
    this.style.overflow = 'auto';

    console.log(this.style);
  }

  print(event){
     if (event.target.id == 'afuera') {
      this.onClose.emit();
    }
  }


  printContrato() {
    const wopen = window.open('/factura-pdf/' + this.facturaPDF._id);
    wopen.onafterprint = (event) => {
      wopen.close();
    };
  }

  async cancelarPago(){
    this.loadingCancelarPago = true
    console.log(this.facturaPDF);
    
    await this._facturaService.cancelarPago(this.facturaPDF._id)
    this.onClose.emit()
    this.loadingCancelarPago = false
  }

}
