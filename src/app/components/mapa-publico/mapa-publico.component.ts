import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ContratoService } from 'src/app/services/contrato.service';

@Component({
  selector: 'app-mapa-publico',
  templateUrl: './mapa-publico.component.html',
  styleUrls: ['./mapa-publico.component.css']
})
export class MapaPublicoComponent implements OnInit {

  constructor(
    private _contratoService: ContratoService
  ) { }
  inputClientes = new Subject<string>();
  clientes: any[] = null;
  loadingClientes = false;
  ubicaion_contrato = null;
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.ci.toLowerCase().indexOf(term)
  }
  cliente: any;

  ngOnInit(): void {
    this.observableBuscadores()
  }

  observableBuscadores() {
    this.inputClientes.pipe(

      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingClientes = true;
        this.clientes = await this._contratoService.getInhumado({ search: { ci: txt } });
        console.log(this.clientes);
        
        this.loadingClientes = false;
      });
  }

  selectContrato(){
    console.log("me clickearon");
    console.log(this.cliente);
    if (this.cliente?.contrato_udp) {
      this.ubicaion_contrato = this.cliente.contrato_udp[0]
      
    }
  }
}
