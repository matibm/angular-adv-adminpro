import { WhatsappService } from './../../services/whatsapp.service';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {
  configurations
  chats = [];
  constructor(private settingsService: SettingsService,

    private _whatsappService: WhatsappService,
    private _userService: UsuarioService
  ) { }
  tokenQr;
  authenticated = false;
  timbrado: any = {}
  fechaSolicitud
  fechaVigenciaInicio
  fechaVigenciaFin
  ruc
  timbrados
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
    this.getConfigurations()
    this.settingsService.checkCurrentTheme();
  }
  async getConfigurations() {
    this.timbrados = await this._userService.getConfigurations({ type: 'TIMBRADO' })
    console.log(this.timbrados);
    
  }
  changeTheme(theme: string) {

    this.settingsService.changeTheme(theme);



  }

  async generateQr() {
    // this.tokenQr = await this._whatsappService.generateQr()
    this._whatsappService.pruebaSocket();
  }

  async crearTimbrado() {
    this.timbrado.fecha_vigente_inicio = this.fechaVigenciaInicio
    this.timbrado.fecha_vigente_fin = this.fechaVigenciaFin
    this.timbrado.fecha_solicitud = this.fechaSolicitud
    let obj = {
      key: 'TIMBRADO_ACTUAL',
      type: 'TIMBRADO',
      tag: 'timbrado',
      value: null,
      body: this.timbrado,
      nota: ''
    }
    console.log(obj);
    
    await this._userService.createConfiguration(obj)
    window.location.reload()
  }



}
