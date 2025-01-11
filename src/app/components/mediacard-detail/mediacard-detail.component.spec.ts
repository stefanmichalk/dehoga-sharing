import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediacardDetailComponent } from './mediacard-detail.component';

describe('MediacardDetailComponent', () => {
  let component: MediacardDetailComponent;
  let fixture: ComponentFixture<MediacardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediacardDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediacardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
