import { CrearContratoComponent } from './crear-contrato/crear-contrato.component';
import { PipeModule } from './../pipes/pipe.module';
import { AvatarModule } from 'ngx-avatar';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncrementadorComponent } from './incrementador/incrementador.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DonaComponent } from './dona/dona.component';
import { ChartsModule } from 'ng2-charts';
import { ListaContratosComponent } from './lista-contratos/lista-contratos.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { InfoContratoComponent } from './info-contrato/info-contrato.component';
import { FacturaComponent } from './factura/factura.component';
import { FacturasComponent } from './facturas/facturas.component';
import { NgxLoadingModule } from 'ngx-loading';
import { CrearEgresoComponent } from './crear-egreso/crear-egreso.component';
import { ListaMovimientosComponent } from './lista-movimientos/lista-movimientos.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContratoPdfComponent } from './contrato-pdf/contrato-pdf.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { InfoCajaComponent } from './info-caja/info-caja.component';
import { EditarContratoComponent } from './editar-contrato/editar-contrato.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ResumenComponent } from './resumen/resumen.component';
import { ListaFacturasComponent } from './lista-facturas/lista-facturas.component';
import { TransferenciaComponent } from './transferencia/transferencia.component';
import {NgxPrintModule} from 'ngx-print';
import { FacturaPdfComponent } from './factura-pdf/factura-pdf.component';
import { CrearProductoComponent } from './crear-producto/crear-producto.component';
import { ListaProductosComponent } from './lista-productos/lista-productos.component';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';
import { CrearFacturaComponent } from './crear-factura/crear-factura.component';
import { ModalContratosComponent } from './modal-contratos/modal-contratos.component';
import { ModalPdfComponent } from './modal-pdf/modal-pdf.component';
import { DatepickerModule } from 'ng2-datepicker';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {  MAT_DATE_LOCALE} from '@angular/material/core';
import { NotifierModule } from 'angular-notifier';
import { MatInputModule } from '@angular/material/input';
import { CobranzaComponent } from './cobranza/cobranza.component';
import { ModalFacturaComponent } from './modal-factura/modal-factura.component';


const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  declarations: [IncrementadorComponent,
    DonaComponent,
    ListaContratosComponent,
    UsuariosComponent,
    PerfilUsuarioComponent,
    InfoContratoComponent,
    FacturaComponent,
    FacturasComponent,
    CrearEgresoComponent,
    ListaMovimientosComponent,
    MovimientosComponent,
    ContratoPdfComponent,
    CrearUsuarioComponent,
    InfoCajaComponent,
    EditarContratoComponent,
    ResumenComponent,
    ListaFacturasComponent,
    TransferenciaComponent,
    FacturaPdfComponent,
    CrearProductoComponent,
    ListaProductosComponent,
    EditarProductoComponent,
    CrearFacturaComponent,
    ModalContratosComponent,
    ModalPdfComponent,
    CrearContratoComponent,
    CobranzaComponent,
    ModalFacturaComponent,

  ],
  imports: [
    AvatarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule, SweetAlert2Module.forRoot(),
    NgxPrintModule,
    NgSelectModule,
    RouterModule,
    NgxPaginationModule,
    NgxLoadingModule.forRoot({}),
    PipeModule,
    NgxMaskModule.forRoot(maskConfig),
    DatepickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NotifierModule.withConfig({
       behaviour: { autoHide: 2000},
       position: { horizontal: {position: 'right'}}
    }),


   ],
  exports: [
    IncrementadorComponent,
    DonaComponent,
    ListaContratosComponent,

  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-PY'},
  ]

})
export class ComponentsModule { }
