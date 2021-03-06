import { FacturaService } from './../../services/factura.service';
import { ActivatedRoute } from '@angular/router';
import { Contrato } from './../../models/contrato';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-factura-pdf',
  templateUrl: './factura-pdf.component.html',
  styleUrls: ['./factura-pdf.component.css']
})
export class FacturaPdfComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public _facturaService: FacturaService

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

  items: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  async ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');



    if (this.facturaPDF) {
      if (this.facturaPDF._id) {
        this.factura = await this.getDetallePago(this.facturaPDF._id);

      } else {
        this.factura = (await this.facturaPDF);

      }
    } else
      if (this.id) {
        this.factura = await this.getDetallePago(this.id);

      }

    if (this.printAltoke) {
      setTimeout(() => {
        window.print();
      }, 500);

      window.onafterprint = (event) => {
        window.close();
      };
    }

    for (let i = 0; i < this.factura.servicios.length; i++) {
      const element = this.factura.servicios[i];
      this.items[i] = element;
      this.total += element.precio,
        this.totalIva += element.diezPorciento;
    }


    this.totalTexto = this.Millones(this.total);

  }

  Unidades(num) {

    switch (num) {
      case 1: return 'UN';
      case 2: return 'DOS';
      case 3: return 'TRES';
      case 4: return 'CUATRO';
      case 5: return 'CINCO';
      case 6: return 'SEIS';
      case 7: return 'SIETE';
      case 8: return 'OCHO';
      case 9: return 'NUEVE';
    }

    return '';
  }// Unidades()

  Decenas(num) {

    const decena = Math.floor(num / 10);
    const unidad = num - (decena * 10);

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0: return 'DIEZ';
          case 1: return 'ONCE';
          case 2: return 'DOCE';
          case 3: return 'TRECE';
          case 4: return 'CATORCE';
          case 5: return 'QUINCE';
          default: return 'DIECI' + this.Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0: return 'VEINTE';
          default: return 'VEINTI' + this.Unidades(unidad);
        }
      case 3: return this.DecenasY('TREINTA', unidad);
      case 4: return this.DecenasY('CUARENTA', unidad);
      case 5: return this.DecenasY('CINCUENTA', unidad);
      case 6: return this.DecenasY('SESENTA', unidad);
      case 7: return this.DecenasY('SETENTA', unidad);
      case 8: return this.DecenasY('OCHENTA', unidad);
      case 9: return this.DecenasY('NOVENTA', unidad);
      case 0: return this.Unidades(unidad);
    }
  }// Unidades()

  DecenasY(strSin, numUnidades) {
    if (numUnidades > 0) {
      return strSin + ' Y ' + this.Unidades(numUnidades);
    }

    return strSin;
  }// DecenasY()

  Centenas(num) {
    const centenas = Math.floor(num / 100);
    const decenas = num - (centenas * 100);

    switch (centenas) {
      case 1:
        if (decenas > 0) {
          return 'CIENTO ' + this.Decenas(decenas);
        }
        return 'CIEN';
      case 2: return 'DOSCIENTOS ' + this.Decenas(decenas);
      case 3: return 'TRESCIENTOS ' + this.Decenas(decenas);
      case 4: return 'CUATROCIENTOS ' + this.Decenas(decenas);
      case 5: return 'QUINIENTOS ' + this.Decenas(decenas);
      case 6: return 'SEISCIENTOS ' + this.Decenas(decenas);
      case 7: return 'SETECIENTOS ' + this.Decenas(decenas);
      case 8: return 'OCHOCIENTOS ' + this.Decenas(decenas);
      case 9: return 'NOVECIENTOS ' + this.Decenas(decenas);
    }

    return this.Decenas(decenas);
  }// Centenas()

  Seccion(num, divisor, strSingular, strPlural) {
    const cientos = Math.floor(num / divisor);
    const resto = num - (cientos * divisor);

    let letras = '';

    if (cientos > 0) {
      if (cientos > 1) {
        letras = this.Centenas(cientos) + ' ' + strPlural;
      }
      else {
        letras = strSingular;
      }
    }

    if (resto > 0) {
      letras += '';
    }

    return letras;
  }// Seccion()

  Miles(num) {
    const divisor = 1000;
    const cientos = Math.floor(num / divisor);
    const resto = num - (cientos * divisor);

    const strMiles = this.Seccion(num, divisor, 'UN MIL', 'MIL');
    const strCentenas = this.Centenas(resto);

    if (strMiles == '') {
      return strCentenas;
    }

    return strMiles + ' ' + strCentenas;
  }// Miles()

  Millones(num) {
    const divisor = 1000000;
    const cientos = Math.floor(num / divisor);
    const resto = num - (cientos * divisor);
    const strMillones = this.Seccion(num, divisor, 'UN MILLON', 'MILLONES');
    const strMiles = this.Miles(resto);

    if (strMillones == '') {
      return strMiles;
    }

    return strMillones + ' ' + strMiles;
  }// Millones()

  NumeroALetras(num) {
    const data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
      letrasCentavos: '',
      letrasMonedaPlural: 'Córdobas', // "PESOS", 'Dólares', 'Bolívares', 'etcs'
      letrasMonedaSingular: 'Córdoba', // "PESO", 'Dólar', 'Bolivar', 'etc'

      letrasMonedaCentavoPlural: 'CENTAVOS',
      letrasMonedaCentavoSingular: 'CENTAVO'
    };

    if (data.centavos > 0) {
      data.letrasCentavos = 'CON ' + (function() {
        if (data.centavos == 1) {
          return this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
        }
        else {
          return this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
        }
      })();
    }

    if (data.enteros == 0) {
      return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    }
    if (data.enteros == 1) {
      return this.Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
    }
    else {
      return this.Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    }
  }

  async getDetallePago(id) {
    const resp = await this._facturaService.getDetallePago(id);

    const pago = resp.pago;
    console.log(pago);

    const facturas = resp.facturas;
    let servicios = [];
    const contratosSinRepetir = [];
    const fsinrepetir = [];

    for (let i = 0; i < facturas.length; i++) {
      const factura = facturas[i];
      let existe = false;

      for (let m = 0; m < fsinrepetir.length; m++) {
        const element = fsinrepetir[m];
        if (element.contrato == factura.contrato && element.haber === factura.haber) {
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

      // if (contratosSinRepetir.includes(factura.contrato) && !factura.parcial) {
      //   for (let j = 0; j < servicios.length; j++) {
      //     const element = servicios[j];
      //     element.cantidad++
      //     element.precio += factura.haber
      //     element.diezPorciento += factura.haber / 11
      //   }
      // } else {
      //   servicios.push({
      //     contrato: factura.contrato,
      //     cantidad: 1,
      //     concepto: `${factura.servicio.NOMBRE}`,
      //     precioUnitario: factura.precio_unitario ? factura.precio_unitario : factura.haber,
      //     precio: factura.haber,
      //     cincoPorciento: null,
      //     diezPorciento: factura.haber / 11
      //   })
      //   contratosSinRepetir.push(factura.contrato)
      // }
      servicios = fsinrepetir;
    }
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
