import { FormStyle } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-modal-pdf',
  templateUrl: './modal-pdf.component.html',
  styleUrls: ['./modal-pdf.component.css']
})
export class ModalPdfComponent implements OnInit {

  constructor() { }
  @Output() onClose = new EventEmitter();
  @Input() contrato;

  style: any = {};
  ngOnInit(): void {
    const height = window.screen.availHeight;
    console.log();

    this.style.maxHeight = (height - 300) + 'px';
    this.style.overflow = 'auto';

    console.log(this.style);
  }

  print(event){
     if (event.target.id == 'afuera') {
      this.onClose.emit();
    }
  }


  printContrato() {
    const wopen = window.open('/contratos-pdf/' + this.contrato._id);
    wopen.onafterprint = (event) => {
      wopen.close();
    };
  }



}
