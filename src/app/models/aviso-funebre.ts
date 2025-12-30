export class AvisoFunebre {
    constructor(
        public _id?: string,
        public nombre_completo?: string,
        public fecha_defuncion?: Date | string,
        public foto?: string,
        public descripcion?: string,
        public activo?: boolean,
        public eliminado?: boolean,
        public publicado?: boolean,
        public fecha_caducidad_publicado?: Date | string | null,
        public fecha_creacion?: number,
        public fecha_actualizacion?: number
    ) {
    }
}

