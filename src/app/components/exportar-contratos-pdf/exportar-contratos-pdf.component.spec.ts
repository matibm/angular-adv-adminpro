import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportarContratosPdfComponent } from './exportar-contratos-pdf.component';

describe('ExportarContratosPdfComponent', () => {
  let component: ExportarContratosPdfComponent;
  let fixture: ComponentFixture<ExportarContratosPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportarContratosPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportarContratosPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
