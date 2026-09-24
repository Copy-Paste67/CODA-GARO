import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicacionForm } from './publicacion-form';

describe('PublicacionForm', () => {
  let component: PublicacionForm;
  let fixture: ComponentFixture<PublicacionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicacionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
