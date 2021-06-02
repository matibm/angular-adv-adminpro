import { PipeModule } from './pipes/pipe.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { URL_SERVICIOS } from './config/global';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
 // =====Modulos=====
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyPipe, CommonModule, registerLocaleData } from '@angular/common';

// =====Componentes=======
import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
 // import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { PricePipe } from './pipes/price.pipe';
import {DpDatePickerModule} from 'ng2-date-picker';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import localePy from '@angular/common/locales/es-PY';
registerLocaleData(localePy, 'es-PY');
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {NgxPaginationModule} from 'ngx-pagination';

// import { LoginComponent } from './auth/login/login.component';
// import { RegisterComponent } from './auth/register/register.component';

// import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';
// import { SidebarComponent } from './shared/sidebar/sidebar.component';
// import { HeaderComponent } from './shared/header/header.component';


import { NgxLoadingModule } from 'ngx-loading';
import { NombreCortoPipe } from './pipes/nombre-corto.pipe';

@NgModule({
  declarations: [
    AppComponent,
    // LoginComponent,
    // RegisterComponent,
    NopagefoundComponent,

    PricePipe,

    // NombreCortoPipe
     // BreadcrumbsComponent,
    // SidebarComponent,
    // HeaderComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    PagesModule,
    HttpClientModule,
    AutocompleteLibModule,
    AuthModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    PipeModule,
    DpDatePickerModule,
    NgSelectModule,
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule
    // NgbModule
  ],
  providers: [CurrencyPipe, { provide: LOCALE_ID, useValue: 'es-PY' }],
  bootstrap: [AppComponent],
  exports: [ NombreCortoPipe]
})
export class AppModule { }
