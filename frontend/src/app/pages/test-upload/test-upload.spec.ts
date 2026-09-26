import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestUpload } from './test-upload';

describe('TestUpload', () => {
  let component: TestUpload;
  let fixture: ComponentFixture<TestUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(TestUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
