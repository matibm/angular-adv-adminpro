import { WhatsappService } from './../../services/whatsapp.service';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { URL_SERVICIOS } from '../../config/global'

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
  URL_ENVIRONMENT = URL_SERVICIOS;
  selectedBackupFile: File | null = null;
  // Actualizar la base desde la carpeta dump del pendrive (equipo offline)
  dumpEnabled = false;
  dumpToolOk = false;
  dumpTargetDb = '';
  dumpFiles: File[] = [];
  dumpCollections: string[] = [];
  dumpSizeMb = '0';
  dumpDropDatabase = true;
  dumpLoading = false;
  dumpProgress = '';
  dumpMessage = '';
  dumpError = false;

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
    this.checkDumpRestore();
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
      const res = await fetch(`${this.URL_ENVIRONMENT}/backup/list?token=${token}`);
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
      const res = await fetch(`${this.URL_ENVIRONMENT}/backup/now?token=${token}`, { method: 'POST' });
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
    window.open(`${this.URL_ENVIRONMENT}/backup/download/${filename}?token=${token}`, '_blank');
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
      const res = await fetch(`${this.URL_ENVIRONMENT}/backup/restore?token=${token}`, {
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

  // El bloque sólo aparece si el backend lo habilita (ALLOW_DUMP_RESTORE=true),
  // así en el servidor de producción ni se muestra.
  async checkDumpRestore() {
    try {
      const token = this._userService.token;
      const res = await fetch(`${this.URL_ENVIRONMENT}/backup/restore-dump/status?token=${token}`);
      const data = await res.json();
      this.dumpEnabled = !!data.habilitado;
      this.dumpToolOk = !!data.herramienta;
      this.dumpTargetDb = data.base || '';
    } catch (e) {
      this.dumpEnabled = false;
    }
  }

  onDumpFolderSelected(event: any) {
    const seleccion: File[] = Array.from(event.target.files || []);
    this.dumpFiles = seleccion.filter(f => /\.(bson|json)(\.gz)?$/i.test(f.name));
    this.dumpCollections = this.dumpFiles
      .filter(f => /\.bson(\.gz)?$/i.test(f.name))
      .map(f => f.name.replace(/\.bson(\.gz)?$/i, ''))
      .sort();
    const bytes = this.dumpFiles.reduce((total, f) => total + f.size, 0);
    this.dumpSizeMb = (bytes / 1024 / 1024).toFixed(1);
    this.dumpMessage = '';
    this.dumpError = false;
    if (seleccion.length && !this.dumpFiles.length) {
      this.dumpError = true;
      this.dumpMessage = 'La carpeta elegida no tiene archivos .bson. Seleccioná la carpeta dump del pendrive.';
    }
  }

  uploadDump() {
    if (!this.dumpFiles.length || this.dumpLoading) { return; }

    const aviso = this.dumpDropDatabase
      ? `Se va a BORRAR la base local (${this.dumpTargetDb}) y reemplazarla con las ${this.dumpCollections.length} colecciones del pendrive. ¿Continuar?`
      : `Se van a reemplazar ${this.dumpCollections.length} colecciones de la base local (${this.dumpTargetDb}). ¿Continuar?`;
    if (!confirm(aviso)) { return; }

    this.dumpLoading = true;
    this.dumpError = false;
    this.dumpMessage = '';
    this.dumpProgress = 'Subiendo archivos... 0%';

    const token = this._userService.token;
    const formData = new FormData();
    // La ruta relativa (dump/v2_imperial/x.bson) va codificada porque el backend
    // recibe sólo el nombre del archivo: así se puede rearmar la carpeta allá.
    this.dumpFiles.forEach(f => formData.append(
      'dumpFiles', f, encodeURIComponent((f as any).webkitRelativePath || f.name)));
    formData.append('dropDatabase', String(this.dumpDropDatabase));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.URL_ENVIRONMENT}/backup/restore-dump?token=${token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        this.dumpProgress = `Subiendo archivos... ${Math.round((e.loaded / e.total) * 100)}%`;
      }
    };
    xhr.onload = () => {
      let data: any = {};
      try { data = JSON.parse(xhr.responseText); } catch (e) { }
      if (xhr.status >= 200 && xhr.status < 300 && data.jobId) {
        this.dumpProgress = 'Archivos recibidos. Restaurando la base...';
        this.pollDumpJob(data.jobId);
      } else {
        this.finishDump(true, data.error || 'Error al subir la carpeta.');
      }
    };
    xhr.onerror = () => this.finishDump(true, 'Error de conexión al subir la carpeta.');
    xhr.send(formData);
  }

  async pollDumpJob(jobId: string, fallos = 0) {
    const token = this._userService.token;
    try {
      const res = await fetch(`${this.URL_ENVIRONMENT}/backup/restore-dump/job/${jobId}?token=${token}`);
      const job = await res.json();
      if (job.estado === 'terminado') {
        this.finishDump(false, job.mensaje);
        return;
      }
      if (job.estado === 'error') {
        this.finishDump(true, `${job.mensaje} ${job.error || ''}`);
        return;
      }
      this.dumpProgress = job.mensaje || 'Restaurando la base...';
      setTimeout(() => this.pollDumpJob(jobId), 2000);
    } catch (e) {
      if (fallos >= 10) {
        this.finishDump(true, 'Se perdió la conexión con el servidor durante la restauración.');
        return;
      }
      setTimeout(() => this.pollDumpJob(jobId, fallos + 1), 3000);
    }
  }

  finishDump(error: boolean, mensaje: string) {
    this.dumpLoading = false;
    this.dumpProgress = '';
    this.dumpError = error;
    this.dumpMessage = mensaje;
    if (!error) {
      this.dumpFiles = [];
      this.dumpCollections = [];
    }
  }
}
