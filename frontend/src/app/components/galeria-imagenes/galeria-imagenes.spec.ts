import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GaleriaImagenes } from './galeria-imagenes';

describe('GaleriaImagenes', () => {
  let component: GaleriaImagenes;
  let fixture: ComponentFixture<GaleriaImagenes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaImagenes],
    }).compileComponents();

    fixture = TestBed.createComponent(GaleriaImagenes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
