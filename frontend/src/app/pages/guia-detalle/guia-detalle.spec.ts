import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuiaDetalle } from './guia-detalle';

describe('GuiaDetalle', () => {
  let component: GuiaDetalle;
  let fixture: ComponentFixture<GuiaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiaDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(GuiaDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
