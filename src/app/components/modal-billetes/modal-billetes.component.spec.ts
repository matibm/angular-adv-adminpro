import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBilletesComponent } from './modal-billetes.component';

describe('ModalBilletesComponent', () => {
  let component: ModalBilletesComponent;
  let fixture: ComponentFixture<ModalBilletesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalBilletesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBilletesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
