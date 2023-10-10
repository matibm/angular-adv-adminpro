import { CrearContratoComponent } from './crear-contrato/crear-contrato.component';
import { PipeModule } from './../pipes/pipe.module';
import { AvatarModule } from 'ngx-avatar';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {  MAT_DATE_LOCALE} from '@angular/material/core';
import { NotifierModule } from 'angular-notifier';
import { MatInputModule } from '@angular/material/input';
import { CobranzaComponent } from './cobranza/cobranza.component';
import { ModalFacturaComponent } from './modal-factura/modal-factura.component';
import { ExtractoPdfComponent } from './extracto-pdf/extracto-pdf.component';
// import { NestableModule } from '@ketshopweb/ngx-nestable';
import { NestableModule } from 'ngx-nestable';
import {MatTreeModule} from '@angular/material/tree';
import { ModalCuentasGastosComponent } from './modal-cuentas-gastos/modal-cuentas-gastos.component';
import { ModalBilletesComponent } from './modal-billetes/modal-billetes.component';
import { GastoComponent } from './gasto/gasto.component';
import { PagosComponent } from './pagos/pagos.component';
import { AccountSettingsComponent } from '../pages/account-settings/account-settings.component';
import { FacturaTicketComponent } from './factura-ticket/factura-ticket.component';
import { ExportarContratosPdfComponent } from './exportar-contratos-pdf/exportar-contratos-pdf.component';
import { ExportarGastosPdfComponent } from './exportar-gastos-pdf/exportar-gastos-pdf.component';
import { MapaComponent } from './mapa/mapa.component';
import { PdfFacturaMobileComponent } from './pdf-factura-mobile/pdf-factura-mobile.component';
import { MapaPublicoComponent } from './mapa-publico/mapa-publico.component';
import { EditGastoComponent } from './edit-gasto/edit-gasto.component';
import { FacturaElectronicaTicketComponent } from './factura-electronica-ticket/factura-electronica-ticket.component';
import { QrCodeModule } from 'ng-qrcode';


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
    ExtractoPdfComponent,
    ModalCuentasGastosComponent,
    ModalBilletesComponent,
    GastoComponent,
    PagosComponent,
    AccountSettingsComponent,
    FacturaTicketComponent,
    ExportarContratosPdfComponent,
    ExportarGastosPdfComponent,
    MapaComponent,
    PdfFacturaMobileComponent,
    MapaPublicoComponent,
    EditGastoComponent,
    FacturaElectronicaTicketComponent
  ],
  imports: [
    AvatarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule, SweetAlert2Module.forRoot(),
    NgxPrintModule,
    NgSelectModule,
    QrCodeModule,

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
    MatProgressSpinnerModule,
    NotifierModule.withConfig({
       behaviour: { autoHide: 2000},
       position: { horizontal: {position: 'right'}}
    }),
    NestableModule,
    MatTreeModule
   ],
  exports: [
    IncrementadorComponent,
    DonaComponent,
    ListaContratosComponent,

  ],
  providers: [
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'es-PY'},
  ]

})
export class ComponentsModule { }
