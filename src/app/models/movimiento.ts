import { Contrato } from './contrato';
import { Usuario } from './usuario';


export class Movimiento {
    constructor(
        public id_movimiento?: string,
        public categoria?: any,
        public tipo_iva?: string,
        public fecha?: string,
        public id_cuentacaja?: string,
        public nombre?: string,
        public signo?: string,
        public exenta?: string,
        public gravada?: string,
        public monto_iva5?: string,
        public monto_iva10?: string,
        public id_cajas?: string,
        public id_concepto?: string,
        public contrato?: Contrato  ,
        public vencimiento_timbrado?: number  ,
        public es_transferencia?: boolean  ,
        public cuenta_padre?: boolean  ,

        public nro_factura?: string,
        public id_moneda?: string,
        public nom_moneda?: string,
        public cotizacion?: string,
        public comentario?: string,
        public cerrado?: string,
        public fecha_cierre?: string,
        public id_sucursal?: string,
        public id_banco?: string,
        public nombre_banco?: string,
        public vencimiento_cheque?: string,
        public nro_comp_banco?: string,
        public nom_tipo_pago?: string,
        public id_tipo_pago?: string,
        public anulado?: string,
        public legal?: string,
        public contado?: string,
        public credito?: string,
        public id_proveedor?: string,
        public nombre_proveedor?: string,
        public monto_total?: number,
        public concepto?: string,
        public aulado?: string,
        public monto_haber?: number,
        public cuota?: string,
        public vencimiento?: string,
        public conciliado?: string,
        public fecha_conciliado?: string,
        public id_cliente?: string,
        public id_referencia?: string,
        public tipo_movimiento?: string,
        public cliente?: Usuario,
        public fondo?: Usuario,
        public proveedor?: Usuario,
        public fecha_creacion_unix?: number
    ) {

    }
}
