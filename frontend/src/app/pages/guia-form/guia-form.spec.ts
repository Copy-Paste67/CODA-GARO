import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuiaForm } from './guia-form';

describe('GuiaForm', () => {
  let component: GuiaForm;
  let fixture: ComponentFixture<GuiaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(GuiaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
