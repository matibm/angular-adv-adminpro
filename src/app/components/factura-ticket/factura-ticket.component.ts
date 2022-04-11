import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contrato } from 'src/app/models/contrato';
import { FacturaService } from 'src/app/services/factura.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-factura-ticket',
  templateUrl: './factura-ticket.component.html',
  styleUrls: ['./factura-ticket.component.css']
})
export class FacturaTicketComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public _facturaService: FacturaService,
    private _userService: UsuarioService


  ) { }

  total = 0;
  totalIva = 0;
  @Input() factura;
  @Input() facturaPDF;
  @Input() printAltoke = true;
  @Input() existe = true;

  totalTexto = '';
  @Input() contrato: Contrato;
  tipo_contrato = '';
  id;
  nro_factura
  nro_talonario
  items: any[] = [];
  timbrado
  fill = (number, len) => "0".repeat(len - number.toString().length) + number.toString();

  async ngOnInit() {
     
    this.timbrado = (await this._userService.getConfigurations({ type: 'TIMBRADO' }))[0].body 
    // {
    //   timbrado: '15074643',
    //   fecha_vigencia_inicio: '01/09/2021',
    //   fecha_vigencia_fin: '30/09/2022',
    //   ruc: '80022091-9',
    //   nro_solicitud: '350010010198',
    //   fecha_solicitud: '31/08/2021'
    // }
    this.id = this.route.snapshot.paramMap.get('id');

    console.log(await this.facturaPDF);


    if (this.facturaPDF) {
      this.nro_factura = (await this.facturaPDF).nro_factura
      this.nro_talonario = (await this.facturaPDF).numero
      if (this.facturaPDF._id) {
        this.factura = await this.getDetallePago(this.facturaPDF._id);

      } else {
        this.factura = (await this.facturaPDF);

      }


    } else
      if (this.id) {
        this.factura = await this.getDetallePago(this.id);

      }

      for (let i = 0; i < this.factura.servicios.length; i++) {
        const element = this.factura.servicios[i];
        // console.log(element);
  
        this.items[i] = element;
        this.total += element.precio,
          this.totalIva += element.diezPorciento;
      }

    setTimeout(() => {
      window.print();
    }, 500);

  
  }
  pago
  async getDetallePago(id) {
    const resp = await this._facturaService.getDetallePago(id);
    
    const pago = resp.pago;
    this.pago = pago
    console.log(pago);
    this.timbrado = resp.pago.timbrado || {
      timbrado: '15074643',
      fecha_vigente_inicio: new Date('2021/09/01'),
      fecha_vigente_fin: new Date('2022/09/30'),
      ruc: '80022091-9',
      nro_solicitud: '350010010198',
      fecha_solicitud: new Date('2021/08/31')
    }
    this.nro_factura = pago.nro_factura
    this.nro_talonario = pago.numero
    const facturas = resp.facturas;
    let servicios = [];
    const contratosSinRepetir = [];
    const fsinrepetir = [];

    console.log(facturas);


    for (let i = 0; i < facturas.length; i++) {
      const factura = facturas[i];
      let existe = false;

      for (let m = 0; m < fsinrepetir.length; m++) {
        const element = fsinrepetir[m];
        // console.log("element.contrato", element.contrato._id);
        // console.log("factura.contrato", factura.contrato._id);
        // console.log("element.haber", element.haber);
        // console.log("factura.haber", factura.haber);

        if (element.contrato._id == factura.contrato._id && element.haber === factura.haber) {
          console.log("sumando");

          element.cantidad++;
          element.precio += factura.haber;
          element.diezPorciento += factura.haber / 11;
          existe = true;
        }
      }
      if (!existe) {
        fsinrepetir.push({
          contrato: factura.contrato,
          cantidad: 1,
          concepto: `${factura.servicio.NOMBRE}`,
          precioUnitario: factura.precio_unitario ? factura.precio_unitario : factura.haber,
          precio: factura.haber,
          cincoPorciento: null,
          haber: factura.haber,
          diezPorciento: factura.haber / 11
        });
      }

      servicios = fsinrepetir;
    }




    // for (let i = 0; i < facturas.length; i++) {
    //   const factura = facturas[i];
    //   let existe = false;

    //   for (let m = 0; m < fsinrepetir.length; m++) {
    //     const element = fsinrepetir[m];
    //     if (element.contrato == factura.contrato && element.haber === factura.haber) {
    //       element.cantidad++;
    //       element.precio += factura.haber;
    //       element.diezPorciento += factura.haber / 11;
    //       existe = true;
    //     }
    //   }
    //   if (!existe) {
    //     fsinrepetir.push({
    //       contrato: factura.contrato,
    //       cantidad: 1,
    //       concepto: `${factura.servicio.NOMBRE}`,
    //       precioUnitario: factura.precio_unitario ? factura.precio_unitario : factura.haber,
    //       precio: factura.haber,
    //       cincoPorciento: null,
    //       haber: factura.haber,
    //       diezPorciento: factura.haber / 11
    //     });
    //   }

    //   // if (contratosSinRepetir.includes(factura.contrato) && !factura.parcial) {
    //   //   for (let j = 0; j < servicios.length; j++) {
    //   //     const element = servicios[j];
    //   //     element.cantidad++
    //   //     element.precio += factura.haber
    //   //     element.diezPorciento += factura.haber / 11
    //   //   }
    //   // } else {
    //   //   servicios.push({
    //   //     contrato: factura.contrato,
    //   //     cantidad: 1,
    //   //     concepto: `${factura.servicio.NOMBRE}`,
    //   //     precioUnitario: factura.precio_unitario ? factura.precio_unitario : factura.haber,
    //   //     precio: factura.haber,
    //   //     cincoPorciento: null,
    //   //     diezPorciento: factura.haber / 11
    //   //   })
    //   //   contratosSinRepetir.push(factura.contrato)
    //   // }
    //   servicios = fsinrepetir;
    // }
    this.facturaPDF = {
      _id: pago._id,
      nombres: pago.nombre,
      fecha: pago.fecha_creacion,
      direccion: pago.direccion,
      ruc: pago.ruc,
      tel: pago.tel,
      notaDeRemision: '123123',
      servicios
    };
    return this.facturaPDF;
  }




}
