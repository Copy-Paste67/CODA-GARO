import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteDetalle } from './reporte-detalle';

describe('ReporteDetalle', () => {
  let component: ReporteDetalle;
  let fixture: ComponentFixture<ReporteDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
