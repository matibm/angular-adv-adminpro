import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ContratoService } from 'src/app/services/contrato.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, OnChanges {

  constructor(
    private _contratoService: ContratoService,
    private router: Router
  ) { }
  @Input() ubicacion_contrato : any
  ubicaciones
  async ngOnInit() {
    this.ubicaciones = await this._contratoService.getMapa()
    console.log(this.ubicaciones);

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes?.ubicacion_contrato?.currentValue) {
      this.getPositionByContrato(changes.ubicacion_contrato.currentValue)
    }
  }

  goToContrato(id) {
    this.router.navigateByUrl(`/admin/info_contrato/${id}`)
  }

  getPositionByContrato(contrato) {
    console.log(contrato);
    console.log(contrato.manzana, contrato.fila, contrato.parcela);
    this.findAndScroll(contrato.manzana+contrato.fila+ parseInt(contrato.parcela))
  }
  findAndScroll(id) {
    // console.log(document.getElementById(id).scrollIntoView({block: "center", inline:'center', behavior: 'smooth'}));
    let ceil = document.getElementById(id)
    ceil.scrollIntoView({ block: "center", inline: 'center', behavior: 'smooth' })
    ceil.parentElement.classList.add('blob')
    ceil.parentElement.classList.add('red')
    // let position = ceil.getBoundingClientRect();
    // console.log(1000, position.top + window.scrollY - 20);

    // window.scrollTo(1000, position.top + window.scrollY - 20);

    console.log(document.getElementById(id));

  }

}
