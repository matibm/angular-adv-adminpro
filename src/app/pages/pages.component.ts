import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';


declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {


  constructor(private settingsService: SettingsService) {
    customInitFunctions();

   } // inyeccion de un servicio

  ngOnInit(): void {

  }

  onClick(event) { 

    if (!event.target) {
      return;
    }
    if (!event.target.classList) {
      return;
    }
    // for (let i = 0; i < event.path.length; i++) {
    //   const element = event.path[i];
    //   if (element.classList) {
    //     if (!element.classList.contains('scroll-sidebar') && !event.target.classList.contains('abridor')) {
    //       if (document.body.classList.contains('show-sidebar')) {
    //         document.body.classList.remove('show-sidebar');
    //         const ticlose = document.getElementById('menu-open-close');
    //         ticlose.classList.remove('ti-close');
    //         ticlose.classList.add('ti-menu');
    //       }

    //     }
    //   }

    // }

  }
}
