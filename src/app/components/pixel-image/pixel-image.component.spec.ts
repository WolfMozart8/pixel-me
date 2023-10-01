import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixelImageComponent } from './pixel-image.component';

describe('PixelImageComponent', () => {
  let component: PixelImageComponent;
  let fixture: ComponentFixture<PixelImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PixelImageComponent]
    });
    fixture = TestBed.createComponent(PixelImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
