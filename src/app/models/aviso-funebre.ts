export class AvisoFunebre {
    constructor(
        public _id?: string,
        public nombre_completo?: string,
        public nacionalidad?: string,
        public fecha_nacimiento?: Date | string,
        public fecha_defuncion?: Date | string,
        public fecha_entierro?: Date | string,
        public hora_fallecimiento?: string,
        public causa_muerte?: string,
        public comentarios?: string,
        public quien_realizo_servicio?: string,
        public foto?: string,
        public descripcion?: string,
        public biografia?: string,
        public ubicacion_cementerio?: string,
        public activo?: boolean,
        public eliminado?: boolean,
        public publicado?: boolean,
        public fecha_caducidad_publicado?: Date | string | null,
        public fecha_creacion?: number,
        public fecha_actualizacion?: number
    ) {
    }
}

