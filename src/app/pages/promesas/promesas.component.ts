import { Component, OnInit } from '@angular/core';
// import { resolve } from 'dns';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    const promesa  = new Promise( ( resolve, reject ) => {

      if (false ){
        resolve('Hola Mundo');
      } else{
        reject('Algo salio mal');
      }



    });
    promesa.then((mensaje ) => {
      console.log(mensaje);

    }).catch(error => console.log('Error en la promesa', error));
    console.log('Fin del Init');

  }

  getUsuarios(  ){

  }

}
