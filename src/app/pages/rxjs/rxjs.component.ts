import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy  {

  public intervalSubs: Subscription;



  constructor() {


    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe(
    //   valor => console.log('Subs:', valor),
    //   error => console.warn('Error:', error),
    //   () => console.info('Obs terminado')

    // );
    this.intervalSubs = this.retornaIntervalo().
    subscribe((valor) => console.log( valor )

    );



   }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
    console.log('observable detenido');

  }

  retornaIntervalo(): Observable <number>{
    return interval(500).
           pipe(
              // take(10),
              map (valor => (valor + 1)),
              filter (valor => (valor % 2 === 0 ) ? true : false),



           );

  }

   retornaObservable(): Observable<number>{
    let i = -1;
    return new Observable<number>( observer => {

      const intervalo = setInterval( () => {

        // console.log('tick');
        i++;
        observer.next(i);
        if (i === 4){
          clearInterval( intervalo );
          observer.complete();
        }

        if (i === 2){
          // i=0;
          observer.error('i ha llegado al valor de 2');
        }

      }, 1000);

    } );
    // return obs$;

  }



}
