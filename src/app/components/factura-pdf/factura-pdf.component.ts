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

  total = 0
  totalIva = 0
  @Input() factura
  @Input() facturaPDF
  @Input() printAltoke = true

  totalTexto = ''
  constructor(
    public route: ActivatedRoute,
    public _facturaService: FacturaService

  ) { }
  @Input() contrato: Contrato
  tipo_contrato = ''
  id
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.facturaPDF) {
      this.factura = await this.getDetallePago(this.facturaPDF._id)
      
    } else 
    if (this.id) {

      
       this.factura = await this.getDetallePago(this.id)
       
      
      
      

    } 

    if (this.printAltoke) {
      setTimeout(() => {
        window.print()  
       }, 500);
       
       window.onafterprint = (event) => {
         window.close()
      };  }

    for (let i = 0; i < this.factura.servicios.length; i++) {
      const element = this.factura.servicios[i];
      this.items[i] = element
      this.total += element.precioUnitario,
        this.totalIva += element.diezPorciento
    }


    this.totalTexto = this.Millones(this.total)

  }

  items: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0]

  Unidades(num) {

    switch (num) {
      case 1: return "UN";
      case 2: return "DOS";
      case 3: return "TRES";
      case 4: return "CUATRO";
      case 5: return "CINCO";
      case 6: return "SEIS";
      case 7: return "SIETE";
      case 8: return "OCHO";
      case 9: return "NUEVE";
    }

    return "";
  }//Unidades()

  Decenas(num) {

    let decena = Math.floor(num / 10);
    let unidad = num - (decena * 10);

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0: return "DIEZ";
          case 1: return "ONCE";
          case 2: return "DOCE";
          case 3: return "TRECE";
          case 4: return "CATORCE";
          case 5: return "QUINCE";
          default: return "DIECI" + this.Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0: return "VEINTE";
          default: return "VEINTI" + this.Unidades(unidad);
        }
      case 3: return this.DecenasY("TREINTA", unidad);
      case 4: return this.DecenasY("CUARENTA", unidad);
      case 5: return this.DecenasY("CINCUENTA", unidad);
      case 6: return this.DecenasY("SESENTA", unidad);
      case 7: return this.DecenasY("SETENTA", unidad);
      case 8: return this.DecenasY("OCHENTA", unidad);
      case 9: return this.DecenasY("NOVENTA", unidad);
      case 0: return this.Unidades(unidad);
    }
  }//Unidades()

  DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
      return strSin + " Y " + this.Unidades(numUnidades)

    return strSin;
  }//DecenasY()

  Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - (centenas * 100);

    switch (centenas) {
      case 1:
        if (decenas > 0)
          return "CIENTO " + this.Decenas(decenas);
        return "CIEN";
      case 2: return "DOSCIENTOS " + this.Decenas(decenas);
      case 3: return "TRESCIENTOS " + this.Decenas(decenas);
      case 4: return "CUATROCIENTOS " + this.Decenas(decenas);
      case 5: return "QUINIENTOS " + this.Decenas(decenas);
      case 6: return "SEISCIENTOS " + this.Decenas(decenas);
      case 7: return "SETECIENTOS " + this.Decenas(decenas);
      case 8: return "OCHOCIENTOS " + this.Decenas(decenas);
      case 9: return "NOVECIENTOS " + this.Decenas(decenas);
    }

    return this.Decenas(decenas);
  }//Centenas()

  Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let letras = "";

    if (cientos > 0)
      if (cientos > 1)
        letras = this.Centenas(cientos) + " " + strPlural;
      else
        letras = strSingular;

    if (resto > 0)
      letras += "";

    return letras;
  }//Seccion()

  Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMiles = this.Seccion(num, divisor, "UN MIL", "MIL");
    let strCentenas = this.Centenas(resto);

    if (strMiles == "")
      return strCentenas;

    return strMiles + " " + strCentenas;
  }//Miles()

  Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)
    let strMillones = this.Seccion(num, divisor, "UN MILLON", "MILLONES");
    let strMiles = this.Miles(resto);

    if (strMillones == "")
      return strMiles;

    return strMillones + " " + strMiles;
  }//Millones()

  NumeroALetras(num) {
    var data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
      letrasCentavos: "",
      letrasMonedaPlural: 'Córdobas',//"PESOS", 'Dólares', 'Bolívares', 'etcs'
      letrasMonedaSingular: 'Córdoba', //"PESO", 'Dólar', 'Bolivar', 'etc'

      letrasMonedaCentavoPlural: "CENTAVOS",
      letrasMonedaCentavoSingular: "CENTAVO"
    };

    if (data.centavos > 0) {
      data.letrasCentavos = "CON " + (function () {
        if (data.centavos == 1)
          return this.Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
        else
          return this.Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
      })();
    };

    if (data.enteros == 0)
      return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return this.Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
    else
      return this.Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
  }

  async getDetallePago(id){
    let resp = await this._facturaService.getDetallePago(id)
     
    let pago = resp.pago
    let facturas = resp.facturas
    let servicios =[]
    for (let i = 0; i < facturas.length; i++) {
      const factura = facturas[i];
      servicios.push({
        cantidad: 1,
        concepto: factura.servicio.NOMBRE,
        precioUnitario: factura.precio_unitario? factura.precio_unitario : factura.haber,
        precio: factura.haber,
        cincoPorciento: null,
        diezPorciento: factura.haber * 0.1
      })
    }
    this.facturaPDF = {
      _id: pago._id,
      nombres: `${pago.cliente.NOMBRES} ${pago.cliente.APELLIDOS}`,
      fecha: pago.fecha_creacion,
      direccion: `direccion de prueba`,
      ruc: pago.cliente.RUC,
      tel: pago.cliente.TELEFONO1,
      notaDeRemision: '123123',
      servicios: servicios
    }
     return this.facturaPDF
  }

}
