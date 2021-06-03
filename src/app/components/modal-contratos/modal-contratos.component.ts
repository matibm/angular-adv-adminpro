import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-modal-contratos',
  templateUrl: './modal-contratos.component.html',
  styleUrls: ['./modal-contratos.component.css']
})
export class ModalContratosComponent implements OnInit {

  constructor() { }

  @Output() onComplete;
  @Output() onClose = new EventEmitter();
  @Output() contratoSelected = new EventEmitter();

  @Input() showFilters = false;
  @Input() contratos;
  @Input() cliente;

  ngOnInit(): void {
  }

  onContratoSelected(contrato){
    this.contratoSelected.emit(contrato);
    this.onClose.emit();

  }

  print(event){
    console.log(event.target);
    if (event.target.id == 'afuera') {
      this.onClose.emit();
    }
  }

}
