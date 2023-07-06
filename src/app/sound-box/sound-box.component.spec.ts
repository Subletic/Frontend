import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SoundBoxComponent } from './sound-box.component';
import { AudioHandlerComponent } from '../audio-handler/audio-handler.component';
import { SliderPopupComponent } from './slider-popup/slider-popup.component';
import { By } from '@angular/platform-browser';

describe('SoundBoxComponent', () => {
  let component: SoundBoxComponent;
  let fixture: ComponentFixture<SoundBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SoundBoxComponent, AudioHandlerComponent, SliderPopupComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isSvg1Active and call playOrStopAudio on playButton click', () => {
    spyOn(component.audioHandler, 'playOrStopAudio');

    const playButton = fixture.debugElement.query(By.css('.play-button'));
    playButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isSvg1Active).toBeFalsy();
    expect(component.audioHandler.playOrStopAudio).toHaveBeenCalled();
  });

  it('should call skipBackward on skipBackwardButton click', () => {
    spyOn(component.audioHandler, 'skipBackward');
  
    const skipBackwardButton = fixture.debugElement.query(By.css('.sound-button-1'));
    skipBackwardButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  
    expect(component.audioHandler.skipBackward).toHaveBeenCalled();
  });

  it('should call skipForward on skipForwardButton click', () => {
    spyOn(component.audioHandler, 'skipForward');
  
    const skipForwardButton = fixture.debugElement.query(By.css('.sound-button-1:nth-child(3)'));
    skipForwardButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  
    expect(component.audioHandler.skipForward).toHaveBeenCalled();
  });

  it('should set isPopupOpen to true on openPopup', () => {
    component.openPopup();

    expect(component.isPopupOpen).toBeTruthy();
  });

  it('should toggle isPopoverOpen on togglePopoverAudio', () => {
    component.isPopoverOpen = false;
    component.togglePopoverAudio();
    expect(component.isPopoverOpen).toBeTruthy();

    component.togglePopoverAudio();
    expect(component.isPopoverOpen).toBeFalsy();
  });

  it('should set isPopoverOpen to false on closePopoverAudio', () => {
    component.isPopoverOpen = true;
    component.closePopoverAudio();
    expect(component.isPopoverOpen).toBeFalsy();
  });

  it('should call setVolume on onVolumeChange', () => {
    spyOn(component.audioHandler, 'setVolume');

    const volume = 0.5;
    component.onVolumeChange(volume);

    expect(component.audioHandler.setVolume).toHaveBeenCalledWith(volume);
  });

  it('should set volume100 on onVolume100Change', () => {
    const volume100 = 50;
    component.onVolume100Change(volume100);

    expect(component.volume100).toEqual(volume100);
  });
});
