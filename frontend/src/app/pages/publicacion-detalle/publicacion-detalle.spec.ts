import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicacionDetalle } from './publicacion-detalle';

describe('PublicacionDetalle', () => {
  let component: PublicacionDetalle;
  let fixture: ComponentFixture<PublicacionDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicacionDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
