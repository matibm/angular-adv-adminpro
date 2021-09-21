import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FacturaService } from 'src/app/services/factura.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {
  fondo
  fondos
  rangeFecha = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  loading
  pagos
  page = 1
  count = 0
  constructor(
    private _facturaService: FacturaService,
    public _usuarioService: UsuarioService,
    public route: ActivatedRoute,
    private router: Router
  ) { }
  body: any = { options: {} }
  ngOnInit(): void {
    this.searchBancos('')
    if (!this.route.snapshot.queryParams.start && !this.route.snapshot.queryParams.end) {
      let month = new Date().getMonth() + 1
      let year = new Date().getFullYear()
      this.rangeFecha.setValue({ start: new Date(`${year}-${month}-01`), end: new Date() })
      this.cambiarQueryParams([
        {
          start: new Date(`${year}-${month}-01`).toLocaleDateString('fr-CA', { year: "numeric", month: "2-digit", day: "2-digit" })
        },
        {
          end: new Date().toLocaleDateString('fr-CA', { year: "numeric", month: "2-digit", day: "2-digit" })
        }
      ])
    }
    if (this.route.snapshot.queryParams.start && this.route.snapshot.queryParams.end) {
      let value = { start: new Date(`${this.route.snapshot.queryParams.start} 00:00`), end: new Date(`${this.route.snapshot.queryParams.end} 00:00`) }
      this.rangeFecha.setValue(value)
    }

    this.body.options['fecha_creacion'] = { $lte: new Date(this.rangeFecha.value.end).getTime(), $gte: new Date(this.rangeFecha.value.start).getTime() }
    this.route.snapshot.queryParams.fondo ? this.seleccionarFondo(this.route.snapshot.queryParams.fondo) : ''

  }
  async seleccionarFondo(fondoId) {
    if (!fondoId) {
      this.pagos = null
      this.count = 0
      return
    }
    this.body.options.fondo = fondoId
    const resp = await this._facturaService.getPagosAll(this.body)
    this.pagos = resp.pagos
    this.count = resp.count
    this.fondo = await this._usuarioService.getUsuarioPorId(fondoId)
    this.cambiarQueryParams([{ fondo: this.fondo._id }])
  }
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return (
      item.NOMBRES?.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS?.toLowerCase().includes(term) ||
      item.RAZON?.toLowerCase().includes(term) ||
      item.RUC?.toLowerCase().includes(term)
    );
  }
  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }
  async filtroPorFecha() {
    if (!this.rangeFecha.value.end) {
      console.log("vacio");
      return
    }
    this.loading = true

    // this.body.options.date_start = this.rangeFecha.value.start ? new Date(this.rangeFecha.value.start).getTime() : null
    // this.body.options.date_end = this.rangeFecha.value.end ? new Date(this.rangeFecha.value.end).setHours(23, 59, 59, 59) : null
    this.body.options['fecha_creacion'] = { $lte: new Date(this.rangeFecha.value.end).setHours(23, 59, 59, 59), $gte: new Date(this.rangeFecha.value.start).getTime() }
    this.body.options.date_start ? this.cambiarQueryParams([
      {
        start: new Date(this.body.date_start).toLocaleDateString('fr-CA', { year: "numeric", month: "2-digit", day: "2-digit" })
      },
      {
        end: new Date(this.body.date_end).toLocaleDateString('fr-CA', { year: "numeric", month: "2-digit", day: "2-digit" })
      }
    ]) : null
    const resp = await this._facturaService.getPagosAll(this.body)
    this.pagos = resp.pagos
    this.count = resp.count
    this.loading = false

  }


  cambiarQueryParams(paths) {
    let queryParams: Params = { ... this.route.snapshot.queryParams }
    for (let i = 0; i < paths.length; i++) {
      const element = paths[i];
      Object.keys(element).forEach((key, index) => {
        queryParams[key] = element[key]

      })

    }
    console.log(queryParams);

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        // skipLocationChange: true
        // queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }
  fill = (number = 0, len = 0) => "0".repeat(len - number?.toString()?.length) + number?.toString();

  generarExcel() {
    this._facturaService.getPagosExcel(this.body.options)
  }
}
