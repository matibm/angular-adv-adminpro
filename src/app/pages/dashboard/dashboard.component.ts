import { WhatsappService } from './../../services/whatsapp.service';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {
  constructor(
    private _whatsappService: WhatsappService

  ) { }

  viendo = document.visibilityState;

  alertas = [];
  @HostListener('document:visibilitychange', ['$event']) onVisibility(event) {

    console.log(document.visibilityState);

    this.viendo = document.visibilityState;
  }

  ngOnInit(): void {
    this._whatsappService.listen('push_actividad').subscribe((data: any) => {
      console.log(data);

      this.alertas.unshift(data);

      if (this.viendo == 'visible') {
        setTimeout(() => {
          // emitir que ya se vio
        }, 3000);
      }

    });
    this._whatsappService.listen('push_actividades').subscribe((data: any) => {
      console.log(data);

      this.alertas = data;
      if (this.viendo == 'visible') {
        setTimeout(() => {
          // emitir que ya se vio
        }, 3000);
      }

    });
    this._whatsappService.emitir('get_actividades', 'e');

  }

}
