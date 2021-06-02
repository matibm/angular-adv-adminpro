import { PipeModule } from './../pipes/pipe.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';


import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';

import { AppRoutingModule } from '../app-routing.module';
import { from } from 'rxjs';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

import { QrCodeModule } from 'ng-qrcode';


import { NgxLoadingModule } from 'ngx-loading';
import { AvatarModule } from 'ngx-avatar';


@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent,


   ],


  exports: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent,
    ComponentsModule
  ],

  imports: [
    CommonModule,
    FormsModule,
     SharedModule,
     AvatarModule,
     PipeModule,
    RouterModule,
    ComponentsModule,
    QrCodeModule,
     NgxLoadingModule.forRoot({})

  ],
})
export class PagesModule { }
