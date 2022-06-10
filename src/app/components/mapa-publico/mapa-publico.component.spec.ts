import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaPublicoComponent } from './mapa-publico.component';

describe('MapaPublicoComponent', () => {
  let component: MapaPublicoComponent;
  let fixture: ComponentFixture<MapaPublicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaPublicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
