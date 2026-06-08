import { AvisoFunebre, crearCamposVisibilidadDefault } from './../../models/aviso-funebre';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AvisosFunebresService } from 'src/app/services/avisos-funebres.service';
import {
  FlyerPortadaModalComponent,
  PortadaGenerada,
} from '../flyer-portada-modal/flyer-portada-modal.component';

@Component({
  selector: 'app-crear-aviso-funebre',
  templateUrl: './crear-aviso-funebre.component.html',
  styleUrls: ['./crear-aviso-funebre.component.css']
})
export class CrearAvisoFunebreComponent implements OnInit {

  constructor(
    public _avisosFunebresService: AvisosFunebresService
  ) { }

  @ViewChild('flyerModal') flyerModal: FlyerPortadaModalComponent;

  aviso: AvisoFunebre = new AvisoFunebre();
  portadaFile: File = null;
  portadaPreview: string | null = null;
  loading = false;

  ngOnInit(): void {
    this.aviso.activo = true;
    this.aviso.publicado = false;
    this.aviso.campos_modal = crearCamposVisibilidadDefault();
    this.aviso.campos_exequias = crearCamposVisibilidadDefault();
  }

  abrirEditorPortada() {
    if (!this.aviso.nombre_completo) {
      alert('Ingresa al menos el nombre del difunto antes de diseñar la portada.');
      return;
    }
    this.flyerModal.abrir();
  }

  onPortadaGenerada(evt: PortadaGenerada) {
    this.portadaFile = evt.file;
    this.portadaPreview = evt.dataUrl;
  }

  /** Opción "Subir imagen": usa el archivo elegido tal cual como portada (sin editor). */
  onImagenSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('El archivo debe ser una imagen.');
      input.value = '';
      return;
    }
    this.portadaFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.portadaPreview = reader.result as string; };
    reader.readAsDataURL(file);
    input.value = ''; // permite volver a elegir el mismo archivo
  }

  eliminarPortada() {
    this.portadaFile = null;
    this.portadaPreview = null;
  }

  async crearAvisoFunebre() {
    if (!this.aviso.nombre_completo || !this.aviso.fecha_defuncion) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    this.loading = true;
    try {
      const formData = new FormData();
      formData.append('nombre_completo', this.aviso.nombre_completo);
      if (this.aviso.nacionalidad) formData.append('nacionalidad', this.aviso.nacionalidad);
      if (this.aviso.fecha_nacimiento) formData.append('fecha_nacimiento', this.aviso.fecha_nacimiento.toString());
      formData.append('fecha_defuncion', this.aviso.fecha_defuncion.toString());
      if (this.aviso.fecha_entierro) formData.append('fecha_entierro', this.aviso.fecha_entierro.toString());
      if (this.aviso.hora_fallecimiento) formData.append('hora_fallecimiento', this.aviso.hora_fallecimiento);
      if (this.aviso.causa_muerte) formData.append('causa_muerte', this.aviso.causa_muerte);
      if (this.aviso.comentarios) formData.append('comentarios', this.aviso.comentarios);
      if (this.aviso.quien_realizo_servicio) formData.append('quien_realizo_servicio', this.aviso.quien_realizo_servicio);

      formData.append('descripcion', this.aviso.descripcion || '');
      formData.append('biografia', this.aviso.biografia || '');
      if (this.aviso.ubicacion_cementerio) formData.append('ubicacion_cementerio', this.aviso.ubicacion_cementerio);
      formData.append('activo', this.aviso.activo ? 'true' : 'false');
      formData.append('publicado', this.aviso.publicado ? 'true' : 'false');

      if (this.aviso.fecha_caducidad_publicado) {
        formData.append('fecha_caducidad_publicado', this.aviso.fecha_caducidad_publicado.toString());
      }

      if (this.portadaFile) {
        formData.append('foto', this.portadaFile);
      }

      formData.append('campos_modal', JSON.stringify(this.aviso.campos_modal));
      formData.append('campos_exequias', JSON.stringify(this.aviso.campos_exequias));

      await this._avisosFunebresService.crearAvisoFunebre(formData);
      window.history.back();
    } catch (error) {
      console.error(error);
      alert('Error al crear el aviso fúnebre');
    } finally {
      this.loading = false;
    }
  }

  cancelar() {
    window.history.back();
  }
}
