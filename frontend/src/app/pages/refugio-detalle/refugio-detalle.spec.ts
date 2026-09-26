import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefugioDetalle } from './refugio-detalle';

describe('RefugioDetalle', () => {
  let component: RefugioDetalle;
  let fixture: ComponentFixture<RefugioDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefugioDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(RefugioDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
