import { Contrato } from './../../models/contrato';
import { ContratoService } from './../../services/contrato.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contrato-pdf',
  templateUrl: './contrato-pdf.component.html',
  styleUrls: ['./contrato-pdf.component.css']
})
export class ContratoPdfComponent implements OnInit {


  constructor(
    public route: ActivatedRoute,
    private _contratoService: ContratoService
  ) { }
  observaciones =`.
  .
.
  `
  id
  @Input() contrato: Contrato
  @Input() printAltoke = true
  tipo_contrato = ''
  diaCadaMes
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.contrato = await this._contratoService.getContratoById(this.id)
    this.tipo_contrato = this.contrato.producto.COD_CORTO

    this.diaCadaMes = new Date(this.contrato.fecha_creacion_unix).getDate()

      if (this.printAltoke) {
        setTimeout(() => {
          window.print()  
         }, 500);
         
         window.onafterprint = (event) => {
           window.close()
        };  }
      }

}
