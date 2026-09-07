import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { ContratoService } from '../../services/contrato.service';
import { ProductosService } from '../../services/productos.service';
import { UsuarioService } from '../../services/usuario.service';
import { RucPipe } from '../../pipes/ruc.pipe';
import { CrearContratoComponent } from './crear-contrato.component';

describe('CrearContratoComponent: entrega y cuotas', () => {
  let fixture: ComponentFixture<CrearContratoComponent>;
  let component: CrearContratoComponent;
  let contratos: any;
  const producto: any = { _id: 'producto', PRECIO_MAYORISTA: 16000000, COD_CORTO: 'U.D.P.', NOMBRE: 'Parcela' };

  beforeEach(async () => {
    contratos = {
      getContratos: jasmine.createSpy().and.returnValue(Promise.resolve({ count: 0 })),
      newContrato: jasmine.createSpy().and.returnValue(Promise.resolve({ _id: 'nuevo' }))
    };
    await TestBed.configureTestingModule({
      declarations: [CrearContratoComponent, RucPipe],
      imports: [FormsModule, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, NoopAnimationsModule],
      providers: [
        CurrencyPipe,
        { provide: ProductosService, useValue: { getProductos: () => Promise.resolve([producto]) } },
        { provide: UsuarioService, useValue: {} },
        { provide: SwalPortalTargets, useValue: {} },
        { provide: ContratoService, useValue: contratos },
        { provide: Router, useValue: { navigateByUrl: jasmine.createSpy() } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(CrearContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    component.fecha_creacion = new Date(2026, 8, 5);
    component.seleccionarProducto(producto);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  async function input(name: string, value: string) {
    const element: HTMLInputElement = fixture.nativeElement.querySelector(`input[name="${name}"]`);
    element.value = value;
    element.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function fecha(date: Date) {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  }

  it('recalcula al agregar, cambiar y borrar la entrega después del plazo', async () => {
    await input('precioTotal', '17000000');
    await input('assasavvv', '50');
    expect(component.montoCuotas).toBe(340000);
    await input('asdsfgsda', '3000000');
    expect(component.saldo).toBe(14000000);
    expect(component.montoCuotas).toBe(280000);
    expect(component.facturas.length).toBe(50);
    expect(component.facturas.every(f => f.monto === 280000)).toBeTrue();
    expect(fecha(component.facturas[0].vencimiento)).toEqual([2026, 10, 5]);
    expect(fecha(component.facturas[1].vencimiento)).toEqual([2026, 11, 5]);
    await input('asdsfgsda', '2000000');
    expect(component.montoCuotas).toBe(300000);
    await input('asdsfgsda', '');
    expect(component.montoCuotas).toBe(340000);
    expect(fecha(component.fechaPago)).toEqual([2026, 9, 5]);
  });

  it('usa el precio y plazo nuevos aunque la entrega se cargue primero', async () => {
    await input('asdsfgsda', '3000000');
    await input('assasavvv', '50');
    await input('precioTotal', '17000000');
    expect(component.montoCuotas).toBe(280000);
    await input('precioTotal', '18000000');
    expect(component.montoCuotas).toBe(300000);
    await input('assasavvv', '60');
    expect(component.montoCuotas).toBe(250000);
  });

  it('actualiza el vencimiento al cambiar la fecha del contrato y respeta una fecha manual', async () => {
    await input('assasavvv', '50');
    await input('asdsfgsda', '3000000');
    // Material interpreta la entrada escrita en formato mes/día/año.
    await input('asdas', '08/15/2026');
    fixture.nativeElement.querySelector('input[name="asdas"]').dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fecha(component.fechaPago)).toEqual([2026, 9, 15]);
    expect(fecha(component.facturas[0].vencimiento)).toEqual([2026, 9, 15]);
    await input('asfdvbntr', '11/10/2026');
    fixture.nativeElement.querySelector('input[name="asfdvbntr"]').dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await input('asdsfgsda', '4000000');
    component.fecha_creacion = new Date(2026, 8, 1);
    component.cambiarFechaContrato();
    expect(fecha(component.fechaPago)).toEqual([2026, 11, 10]);
    expect(fecha(component.facturas[0].vencimiento)).toEqual([2026, 11, 10]);
  });

  it('ajusta fin de mes, año nuevo y febrero bisiesto', () => {
    component.plazo = 3;
    component.fecha_creacion = new Date(2027, 0, 31);
    component.calcularSaldo(3000000);
    expect(fecha(component.fechaPago)).toEqual([2027, 2, 28]);
    component.fecha_creacion = new Date(2028, 0, 31);
    component.cambiarFechaContrato();
    expect(fecha(component.fechaPago)).toEqual([2028, 2, 29]);
    component.fecha_creacion = new Date(2026, 11, 31);
    component.cambiarFechaContrato();
    expect(component.facturas.map(f => fecha(f.vencimiento))).toEqual([[2027, 1, 31], [2027, 2, 28], [2027, 3, 31]]);
  });

  it('envía cuota, total y fechas coherentes sin descontar dos veces la entrega', async () => {
    await input('precioTotal', '17000000');
    await input('assasavvv', '50');
    await input('asdsfgsda', '3000000');
    component.cliente = { _id: 'cliente' } as any;
    component.vendedor = { _id: 'vendedor' } as any;
    component.nro_contrato = 'prueba';
    await component.crearContrato();
    const payload = contratos.newContrato.calls.mostRecent().args[0];
    expect(payload.contrato.cuota).toBe(280000);
    expect(payload.contrato.saldo_pendiente).toBe(17000000);
    expect((payload.contrato.saldo_pendiente - payload.contrato.entrega) / payload.contrato.plazo).toBe(280000);
    expect(fecha(payload.fechaPago)).toEqual([2026, 10, 5]);
    expect(payload.fechaPago.getHours()).toBe(12);
    expect(fecha(new Date(payload.facturaIngreso.vencimiento))).toEqual([2026, 9, 5]);
  });

  it('mantiene el contado sin entrega en la fecha del contrato', async () => {
    component.cliente = { _id: 'cliente' } as any;
    component.vendedor = { _id: 'vendedor' } as any;
    component.nro_contrato = 'prueba';
    await input('precioTotal', '17000000');
    await component.crearContrato();
    const payload = contratos.newContrato.calls.mostRecent().args[0];
    expect(payload.contrato.plazo).toBe(1);
    expect(payload.contrato.saldo_pendiente).toBe(17000000);
    expect(fecha(payload.fechaPago)).toEqual([2026, 9, 5]);
  });

  it('incluye el plus por edad en el saldo financiado', () => {
    component.plazo = 50;
    component.calcularSaldo(3000000);
    component.sumarPlusPorEdad([{ plus_edad: 1000000 }]);
    expect(component.montoCuotas).toBe(280000);
  });
});
