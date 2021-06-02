import { PipeModule } from './../pipes/pipe.module';
import { AvatarModule } from 'ngx-avatar';
import { NombreCortoPipe } from './../pipes/nombre-corto.pipe';
import { TitleBreadcrumbPipe } from './../pipes/title-breadcrumb.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent,
    TitleBreadcrumbPipe,
    // NombreCortoPipe
  ],
  exports: [
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  imports: [
    AvatarModule,
    CommonModule,
    RouterModule,
    PipeModule
  ]
})
export class SharedModule { }
