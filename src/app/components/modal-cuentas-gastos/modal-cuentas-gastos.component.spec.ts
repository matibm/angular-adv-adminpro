import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCuentasGastosComponent } from './modal-cuentas-gastos.component';

describe('ModalCuentasGastosComponent', () => {
  let component: ModalCuentasGastosComponent;
  let fixture: ComponentFixture<ModalCuentasGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCuentasGastosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCuentasGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
