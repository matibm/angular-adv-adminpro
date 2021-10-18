import { Component, OnInit } from '@angular/core';
import { ContratoService } from 'src/app/services/contrato.service';

@Component({
  selector: 'app-exportar-contratos-pdf',
  templateUrl: './exportar-contratos-pdf.component.html',
  styleUrls: ['./exportar-contratos-pdf.component.css']
})
export class ExportarContratosPdfComponent implements OnInit {

  constructor(
    private _contratoService: ContratoService
  ) { }
  contratos
  async ngOnInit() {
    let options: any = localStorage.getItem('options_extracto_contratos')
      ? JSON.parse(localStorage.getItem('options_extracto_contratos'))
      : {};
    let resp = await this._contratoService.getContratos(1, options)
    this.contratos = resp.contratos
    setTimeout(() => {
      window.print()  
    }, 500
    );
  }

}
