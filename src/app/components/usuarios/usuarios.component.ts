import { Usuario } from './../../models/usuario';
import { UsuarioService } from './../../services/usuario.service';
import { Component, DoCheck, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { of } from 'rxjs';

import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, DoCheck {
  constructor(
    public _usuarioService: UsuarioService
  ) { }
  @ViewChild('searchInput', { static: true }) search: ElementRef;
  @ViewChildren('searchInput') searchInput: QueryList<ElementRef>;
  usuarios: Usuario[];
  public loading = false;

  isSearching = false;
  apiResponse = [];
  searching;

  async ngOnInit() {
    this.loading = true;
    setTimeout(() => {
      this.searchInput.first.nativeElement.focus();

    }, 100);
    // this.usuarios = await this._usuarioService.getUsuarios();
    console.log(this.usuarios);
    this.loading = false;



    // elem ref
    const searchBox = document.getElementById('search');

    // streams
    const keyup$ = fromEvent(searchBox, 'keyup');

    // wait .5s between keyups to emit current value
    keyup$
      .pipe(
        map((i: any) => i.currentTarget.value),
        debounceTime(700),
        distinctUntilChanged()

      )
      .subscribe(async (txt) => {
        this.isSearching = true;
        this.usuarios = await this._usuarioService.buscarUsuarios('ALL', txt);
        this.isSearching = false;
      });


  }

  async ngDoCheck() {















    // fromEvent(this.search.nativeElement, 'keyup').pipe(

    //   // get value
    //   map((event: any) => {
    //     return event.target.value;
    //   })
    //   // if character length greater then 2
    //   , filter(res => res.length > 2)

    //   // Time in milliseconds between key events
    //   , debounceTime(1000)

    //   // If previous query is diffent from current
    //   , distinctUntilChanged()

    //   // subscription for response
    // ).subscribe(async (text: string) => {
    //   try {

    //     this.isSearching = true;


    //     this.usuarios = await this._usuarioService.buscarUsuarios('ALL', text)
    //     this.isSearching = false;

    //   } catch (error) {
    //     console.log(error);
    //     return
    //   }
    // this.searchGetCall(text).subscribe((res) => {
    //   console.log('res', res);
    //   this.isSearching = false;
    //   this.apiResponse = res;
    // }, (err) => {
    //   this.isSearching = false;
    //   console.log('error', err);
    // });

    // });


  }


  async searchUsuarios(val: any) {

    if (val.length > 0) {


      this.usuarios = await this._usuarioService.buscarUsuarios('ALL', this.searching);

    }
  }
}
