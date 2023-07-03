
  /*

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SliderPopupComponent } from './slider-popup.component';

describe('SliderPopupComponent', () => {
  let component: SliderPopupComponent;
  let fixture: ComponentFixture<SliderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SliderPopupComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update slider position when calling updateSliderPosition method', () => {
    const position = { top: '10px', left: '20px' };
    component.updateSliderPosition();
    const sliderWrapper = fixture.nativeElement.querySelector('.slider-wrapper');
    expect(sliderWrapper.style.getPropertyValue('--slider-top')).toEqual(position.top);
    expect(sliderWrapper.style.getPropertyValue('--slider-left')).toEqual(position.left);
  });

  it('should emit volume changes when calling onVolumeChange method', () => {
    const volume = 0.5;
    const volume100 = 50;
    const event = { target: { value: '50' } };
    spyOn(component.volumeChange, 'emit');
    spyOn(component.volume100Change, 'emit');

    component.onVolumeChange(event);
    expect(component.volumeChange.emit).toHaveBeenCalledWith(volume);
    expect(component.volume100Change.emit).toHaveBeenCalledWith(volume100);
  });
  
});

*/
