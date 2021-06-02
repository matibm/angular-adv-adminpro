import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component  {


  public labels1: string[] = ['Pan', 'Leche', 'Azucar'];
  public data1 = [
    [350, 450, 100],
  ];

  public labels2: string[] = ['PH', 'Crema Dental', 'Fluor'];
  public data2 = [500, 300, 29];

  public labels3: string[] = ['Joyas', 'Pinturas', 'Zapatillas'];
  public data3 = [50, 60, 70];

}
