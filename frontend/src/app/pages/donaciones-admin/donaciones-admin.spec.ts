import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonacionesAdmin } from './donaciones-admin';

describe('DonacionesAdmin', () => {
  let component: DonacionesAdmin;
  let fixture: ComponentFixture<DonacionesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonacionesAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(DonacionesAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
