import { WhatsappService } from './../../services/whatsapp.service';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  chats = [];
  constructor(private settingsService: SettingsService,

              private _whatsappService: WhatsappService
  ) { }
  tokenQr;
  authenticated = false;

  ngOnInit(): void {
    this._whatsappService.listen('push_actividad').subscribe((data: any) => {
      console.log(data);

      if (data.authenticated == false) {
        this.tokenQr = data.token;
      }
      if (data.authenticated == true) {
        this.authenticated = true;
        if (data.message) {
          this.chats.push(data.message);
        }
      }

    });

    this.settingsService.checkCurrentTheme();
  }

  changeTheme(theme: string) {

    this.settingsService.changeTheme(theme);



  }

  async generateQr() {
    // this.tokenQr = await this._whatsappService.generateQr()
    this._whatsappService.pruebaSocket();
  }




}
