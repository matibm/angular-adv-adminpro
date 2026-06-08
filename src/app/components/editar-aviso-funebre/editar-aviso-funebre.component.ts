import { AvisoFunebre, crearCamposVisibilidadDefault } from './../../models/aviso-funebre';
import { AvisosFunebresService } from './../../services/avisos-funebres.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { URL_SERVICIOS } from '../../config/global';
import { UsuarioService } from '../../services/usuario.service';
import {
  FlyerPortadaModalComponent,
  PortadaGenerada,
} from '../flyer-portada-modal/flyer-portada-modal.component';

@Component({
  selector: 'app-editar-aviso-funebre',
  templateUrl: './editar-aviso-funebre.component.html',
  styleUrls: ['./editar-aviso-funebre.component.css']
})
export class EditarAvisoFunebreComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    public _avisosFunebresService: AvisosFunebresService,
    public _usuarioService: UsuarioService
  ) { }

  @ViewChild('flyerModal') flyerModal: FlyerPortadaModalComponent;

  id: string;
  aviso: AvisoFunebre;

  // Portada nueva generada por flyer-gen (sólo se envía al backend si existe).
  portadaFile: File = null;

  // Preview en pantalla: si hay portadaFile usa el dataUrl del flyer; en caso contrario
  // muestra la foto ya guardada en el aviso.
  portadaPreview: string | null = null;

  loading = false;

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.aviso = await this._avisosFunebresService.getAvisoFunebreById(this.id);

    // Formatear fechas para el input date
    if (this.aviso.fecha_defuncion) {
      const fechaDef = new Date(this.aviso.fecha_defuncion);
      this.aviso.fecha_defuncion = fechaDef.toISOString().split('T')[0];
    }

    if (this.aviso.fecha_nacimiento) {
      const fechaNac = new Date(this.aviso.fecha_nacimiento);
      this.aviso.fecha_nacimiento = fechaNac.toISOString().split('T')[0];
    }

    if (this.aviso.fecha_entierro) {
      const fechaEnt = new Date(this.aviso.fecha_entierro);
      this.aviso.fecha_entierro = fechaEnt.toISOString().split('T')[0];
    }

    if (this.aviso.fecha_caducidad_publicado) {
      const fechaCad = new Date(this.aviso.fecha_caducidad_publicado);
      this.aviso.fecha_caducidad_publicado = fechaCad.toISOString().split('T')[0];
    }

    // Asegurar que campos de visibilidad existan (para registros antiguos)
    if (!this.aviso.campos_modal) {
      this.aviso.campos_modal = crearCamposVisibilidadDefault();
    }
    if (!this.aviso.campos_exequias) {
      this.aviso.campos_exequias = crearCamposVisibilidadDefault();
    }

    // Cargar preview de la portada existente si existe.
    if (this.aviso.foto) {
      if (this.aviso.foto.startsWith('http')) {
        this.portadaPreview = this.aviso.foto;
      } else if (this.aviso.foto.startsWith('/uploads/avisos_funebres/')) {
        const filename = this.aviso.foto.split('/').pop();
        const token = this._usuarioService?.token || '';
        this.portadaPreview = `${URL_SERVICIOS}/avisos-funebres/imagen/${filename}?token=${token}`;
      } else {
        this.portadaPreview = `${URL_SERVICIOS}${this.aviso.foto}`;
      }
    }
  }

  abrirEditorPortada() {
    if (!this.aviso?.nombre_completo) {
      alert('El aviso debe tener un nombre antes de diseñar la portada.');
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

  /** Descarta la portada recién generada y vuelve a mostrar la actual del aviso. */
  eliminarPortadaNueva() {
    this.portadaFile = null;
    if (this.aviso?.foto) {
      if (this.aviso.foto.startsWith('http')) {
        this.portadaPreview = this.aviso.foto;
      } else if (this.aviso.foto.startsWith('/uploads/avisos_funebres/')) {
        const filename = this.aviso.foto.split('/').pop();
        const token = this._usuarioService?.token || '';
        this.portadaPreview = `${URL_SERVICIOS}/avisos-funebres/imagen/${filename}?token=${token}`;
      } else {
        this.portadaPreview = `${URL_SERVICIOS}${this.aviso.foto}`;
      }
    } else {
      this.portadaPreview = null;
    }
  }

  async guardarAvisoFunebre() {
    if (!this.aviso.nombre_completo || !this.aviso.fecha_defuncion) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    this.loading = true;
    try {
      const formData = new FormData();
      formData.append('_id', this.aviso._id);
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
      } else {
        formData.append('fecha_caducidad_publicado', '');
      }

      if (this.portadaFile) {
        formData.append('foto', this.portadaFile);
      }

      formData.append('campos_modal', JSON.stringify(this.aviso.campos_modal));
      formData.append('campos_exequias', JSON.stringify(this.aviso.campos_exequias));

      await this._avisosFunebresService.actualizarAvisoFunebre(formData);
      window.history.back();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el aviso fúnebre');
    } finally {
      this.loading = false;
    }
  }

  cancelar() {
    window.history.back();
  }
}
