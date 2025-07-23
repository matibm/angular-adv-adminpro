import { WhatsappService } from './../../services/whatsapp.service';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { URL_ENVIRONMENT } from 'src/environments/environment';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [],
})
export class AccountSettingsComponent implements OnInit {
  chats = [];
  constructor(
    private settingsService: SettingsService,

    private _whatsappService: WhatsappService,
    private _userService: UsuarioService,
  ) {}
  tokenQr;
  authenticated = false;
  timbrado: any = {};
  fechaSolicitud;
  fechaVigenciaInicio;
  fechaVigenciaFin;
  ruc;
  timbrados;
  configurations: any;
  setConfigurations: any;
  utlNroFactura = 0
  printInvoice = false
  // Backup
  backups: string[] = [];
  backupLoading = false;
  backupMessage = '';
  selectedBackupFile: File | null = null;

  ngOnInit(): void {
    this.printInvoice = localStorage.getItem('print_invoice') ? true : false
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
    this.getConfigurations();
    this.settingsService.checkCurrentTheme();
    this.listBackups();
  }

  async getConfigurations() {
    this.configurations = await this._userService.getConfigurations();
    console.log(this.configurations);
    this.configurations.forEach((element) => {
      this.setConfigurations = element;
      console.log(element.data?.ult_nro_factura_creado);
      this.utlNroFactura = element.data?.ult_nro_factura_creado
    });
  }
  changeTheme(theme: string) {
    this.settingsService.changeTheme(theme);
  }

  async generateQr() {
    // this.tokenQr = await this._whatsappService.generateQr()
    this._whatsappService.pruebaSocket();
  }

  async crearTimbrado() {
    this.timbrado.fecha_vigente_inicio = this.fechaVigenciaInicio;
    this.timbrado.fecha_vigente_fin = this.fechaVigenciaFin;
    this.timbrado.fecha_solicitud = this.fechaSolicitud;
    let obj = {
      key: 'TIMBRADO_ACTUAL',
      type: 'TIMBRADO',
      tag: 'timbrado',
      value: null,
      body: this.timbrado,
      nota: '',
    };
    console.log(obj);

    await this._userService.createConfiguration(obj);
    window.location.reload();
  }

  updateDB() {
    this._whatsappService.updateDB();
  }

  async updateConfiguration(configuration, nro_factura) {
    console.log(nro_factura);

    const body = {
      ...configuration,

      data: {
        ult_nro_factura_creado: +nro_factura,
      },
    }
    await this._userService.updateConfiguration(body);

  }

  printInvoiceSwitch(value){
    if (value) {
      localStorage.setItem('print_invoice', 'true')
    } else {
      localStorage.removeItem('print_invoice')
    }
  }

  async listBackups() {
    this.backupLoading = true;
    this.backupMessage = '';
    try {
      const token = this._userService.token;
      const res = await fetch(`${URL_ENVIRONMENT}/backup/list?token=${token}`);
      this.backups = await res.json();
    } catch (e) {
      this.backupMessage = 'Error al listar backups';
    }
    this.backupLoading = false;
  }

  async createBackup() {
    this.backupLoading = true;
    this.backupMessage = '';
    try {
      const token = this._userService.token;
      const res = await fetch(`${URL_ENVIRONMENT}/backup/now?token=${token}`, { method: 'POST' });
      const data = await res.json();
      this.backupMessage = data.message || 'Backup creado';
      this.listBackups();
    } catch (e) {
      this.backupMessage = 'Error al crear backup';
    }
    this.backupLoading = false;
  }

  downloadBackup(filename: string) {
    const token = this._userService.token;
    window.open(`${URL_ENVIRONMENT}/backup/download/${filename}?token=${token}`, '_blank');
  }

  onBackupFileSelected(event: any) {
    this.selectedBackupFile = event.target.files[0];
  }

  async restoreBackup() {
    if (!this.selectedBackupFile) return;
    this.backupLoading = true;
    this.backupMessage = '';
    try {
      const token = this._userService.token;
      const formData = new FormData();
      formData.append('backupFile', this.selectedBackupFile);
      const res = await fetch(`${URL_ENVIRONMENT}/backup/restore?token=${token}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      this.backupMessage = data.message || data.error || 'Restauración completada';
    } catch (e) {
      this.backupMessage = 'Error al restaurar backup';
    }
    this.backupLoading = false;
  }
}
