import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Guias } from './guias';

describe('Guias', () => {
  let component: Guias;
  let fixture: ComponentFixture<Guias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Guias],
    }).compileComponents();

    fixture = TestBed.createComponent(Guias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
