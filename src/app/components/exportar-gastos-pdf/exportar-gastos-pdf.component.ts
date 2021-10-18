import { Component, OnInit } from '@angular/core';
import { MovimientoService } from 'src/app/services/movimiento.service';

@Component({
  selector: 'app-exportar-gastos-pdf',
  templateUrl: './exportar-gastos-pdf.component.html',
  styleUrls: ['./exportar-gastos-pdf.component.css']
})
export class ExportarGastosPdfComponent implements OnInit {

  constructor(  ) { }
  options
  async ngOnInit() {
    this.options = localStorage.getItem('options_extracto_gastos')
      ? JSON.parse(localStorage.getItem('options_extracto_gastos'))
      : {};
    
  }

}
