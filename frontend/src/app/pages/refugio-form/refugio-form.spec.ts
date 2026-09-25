import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefugioForm } from './refugio-form';

describe('RefugioForm', () => {
  let component: RefugioForm;
  let fixture: ComponentFixture<RefugioForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefugioForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RefugioForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
