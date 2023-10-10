import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaElectronicaTicketComponent } from './factura-electronica-ticket.component';

describe('FacturaElectronicaTicketComponent', () => {
  let component: FacturaElectronicaTicketComponent;
  let fixture: ComponentFixture<FacturaElectronicaTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaElectronicaTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaElectronicaTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
