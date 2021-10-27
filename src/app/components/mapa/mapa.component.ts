import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContratoService } from 'src/app/services/contrato.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  constructor(
    private _contratoService: ContratoService,
    private router: Router
  ) { }
  ubicaciones
  async ngOnInit(){
    this.ubicaciones = await this._contratoService.getMapa()
  }

  goToContrato(id){
    this.router.navigateByUrl(`/admin/info_contrato/${id}`)
  }

}
