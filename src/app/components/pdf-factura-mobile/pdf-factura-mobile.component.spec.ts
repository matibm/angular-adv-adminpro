import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFacturaMobileComponent } from './pdf-factura-mobile.component';

describe('PdfFacturaMobileComponent', () => {
  let component: PdfFacturaMobileComponent;
  let fixture: ComponentFixture<PdfFacturaMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfFacturaMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfFacturaMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
