import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: [ './progress.component.css'
  ]
})
export class ProgressComponent  {
    progreso1 = 15;
    progreso2 = 25;

    get getProgreso1(){
      return `${ this.progreso1 }%`;

    }

    get getProgreso2(){
      return `${this.progreso2}%`;
    }

    cambioValorHijo(valor: number){
      console.log('Ha cambiado el Valor', valor);

    }
}
