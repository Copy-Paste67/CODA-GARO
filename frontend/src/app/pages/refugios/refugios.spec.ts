import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Refugios } from './refugios';

describe('Refugios', () => {
  let component: Refugios;
  let fixture: ComponentFixture<Refugios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Refugios],
    }).compileComponents();

    fixture = TestBed.createComponent(Refugios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
