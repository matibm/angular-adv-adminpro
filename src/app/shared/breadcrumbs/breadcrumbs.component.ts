
// import { Observable} from 'rxjs';
// import {   } from 'rxjs/operator';
import { filter } from 'rxjs/operators';

import { SidebarService } from 'src/app/services/sidebar.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnInit {
  urlbrm = [];
  title = '';
  constructor(
    public activedRoute: ActivatedRoute,
    public route: Router,
    public sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.urlbrm = this.route.url.slice(1).split('/');
    this.title = this.urlbrm[1];
    this.route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      // this.urlbrm = e.url.slice(1).split('/');
      
      // this.title = this.urlbrm[1];
      console.log(e);
      
    });


  }

  onback(){
    window.history.back();
  }


}
