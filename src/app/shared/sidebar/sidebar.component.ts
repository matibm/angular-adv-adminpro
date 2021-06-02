import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {
  class = '';
  menuItems: any[];
  constructor(public sidebarService: SidebarService) {
    this.menuItems = sidebarService.menu;
    console.log(this.menuItems);

  }

  ngOnInit(): void {
  }

  onclickItem(event) {
     this.sidebarService.refreshRoute();
     for (let u = 0; u < event.target.parentElement.parentElement.childNodes.length; u++) {
      const element = event.target.parentElement.parentElement.childNodes[u];
      if (element.firstChild) {
        element.firstChild.classList.remove('active');

      }

    }
     event.target.classList.add('active');
  }

}
