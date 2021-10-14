import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaTicketComponent } from './factura-ticket.component';

describe('FacturaTicketComponent', () => {
  let component: FacturaTicketComponent;
  let fixture: ComponentFixture<FacturaTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
