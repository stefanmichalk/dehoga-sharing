import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialWrapperComponent } from './testimonial-wrapper.component';

describe('TestimonialWrapperComponent', () => {
  let component: TestimonialWrapperComponent;
  let fixture: ComponentFixture<TestimonialWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
