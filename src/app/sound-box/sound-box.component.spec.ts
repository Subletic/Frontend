import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SoundBoxComponent } from './sound-box.component';
import { AudioHandlerComponent } from '../audio-handler/audio-handler.component';
import { SliderPopupComponent } from './slider-popup/slider-popup.component';
import { By } from '@angular/platform-browser';
import { SettingsComponent } from '../settings/settings.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SoundBoxComponent', () => {
  let component: SoundBoxComponent;
  let fixture: ComponentFixture<SoundBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatIconModule, MatFormFieldModule, FormsModule, MatInputModule, BrowserAnimationsModule],
      declarations: [SoundBoxComponent, AudioHandlerComponent, SliderPopupComponent, SettingsComponent]
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

  it('should toggle isAudioPlaying and call playOrStopAudio on playButton click', () => {
    spyOn(component.audioHandler, 'playOrStopAudio');

    const playButton = fixture.debugElement.query(By.css('.play-button'));
    playButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isAudioPlaying).toBeFalsy();
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

  it('should toggle isAudioPopoverOpen on togglePopoverAudio', () => {
    component.isAudioPopoverOpen = false;
    component.switchPopoverAudio();
    expect(component.isAudioPopoverOpen).toBeTruthy();

    component.switchPopoverAudio();
    expect(component.isAudioPopoverOpen).toBeFalsy();
  });

  it('should set isAudioPopoverOpen to false on closePopoverAudio', () => {
    component.isAudioPopoverOpen = true;
    component.closePopoverAudio();
    expect(component.isAudioPopoverOpen).toBeFalsy();
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
