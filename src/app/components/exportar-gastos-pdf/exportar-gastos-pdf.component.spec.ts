import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportarGastosPdfComponent } from './exportar-gastos-pdf.component';

describe('ExportarGastosPdfComponent', () => {
  let component: ExportarGastosPdfComponent;
  let fixture: ComponentFixture<ExportarGastosPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportarGastosPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportarGastosPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
