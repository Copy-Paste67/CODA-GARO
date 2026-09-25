import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteForm } from './reporte-form';

describe('ReporteForm', () => {
  let component: ReporteForm;
  let fixture: ComponentFixture<ReporteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
