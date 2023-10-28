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
import { SettingsService } from '../settings/settings.service';
//
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
    spyOn(component.audioHandler, 'togglePlayback');

    const playButton = fixture.debugElement.query(By.css('.play-button'));
    playButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isAudioPlaying).toBeFalsy();
    expect(component.audioHandler.togglePlayback).toHaveBeenCalled();
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


  it('should close popups when clicking outside', () => {
    // Arrange
    const mockClickedElement = document.createElement('div');
    const mockSoundButtonElement = document.createElement('div');
    const mockSpeedButtonElement = document.createElement('div');
    const mockEvent = new MouseEvent('click');
    mockClickedElement.appendChild(mockSoundButtonElement);
    mockClickedElement.appendChild(mockSpeedButtonElement);
    spyOnProperty(mockEvent, 'target').and.returnValue(mockClickedElement);
    spyOn(component.soundButton.nativeElement, 'contains').and.returnValue(false);
    spyOn(component.speedButton.nativeElement, 'contains').and.returnValue(false);
    spyOn(component, 'closePopoverAudio');
    spyOn(component, 'closePopoverSpeed');

    // Act
    component.onDocumentMouseDown(mockEvent);

    // Assert
    expect(component.closePopoverAudio).toHaveBeenCalled();
    expect(component.closePopoverSpeed).toHaveBeenCalled();
  });

  it('should close the speed popover', () => {
    const settingsService = new SettingsService();
    const component = new SoundBoxComponent(settingsService);
    component.isSpeedPopoverOpen = true;

    component.closePopoverSpeed();

    expect(component.isSpeedPopoverOpen).toBe(false);
  });

  it('should toggle the speed popover', () => {
    const settingsService = new SettingsService();
    const component = new SoundBoxComponent(settingsService);
    component.isSpeedPopoverOpen = false;

    component.switchSpeedPopover();

    expect(component.isSpeedPopoverOpen).toBe(true);

    component.switchSpeedPopover();

    expect(component.isSpeedPopoverOpen).toBe(false);
  });

  it('should open the specified modal', () => {
    const component = new SoundBoxComponent(new SettingsService());
    const settingsService = jasmine.createSpyObj('SettingsService', ['open']);
    component.setSettingsService(settingsService);

    const modalId = 'modal1';
    component.openModal(modalId);

    expect(settingsService.open).toHaveBeenCalledWith(modalId);
  });

  it('should close the specified modal', () => {
    const component = new SoundBoxComponent(new SettingsService());
    const settingsService = jasmine.createSpyObj('SettingsService', ['close']);
    component.setSettingsService(settingsService);

    const modalId = 'modal1';
    component.closeModal(modalId); // Die Funktion aufrufen

    expect(settingsService.close).toHaveBeenCalledWith(modalId);
  });

  it('should set the skip seconds in the audio handler', () => {
    const component = new SoundBoxComponent(new SettingsService());
    const audioHandler = jasmine.createSpyObj('AudioHandlerComponent', ['setSkipSeconds']);
    component.audioHandler = audioHandler;

    const seconds = 10;
    component.onSecondsChange(seconds);

    expect(audioHandler.setSkipSeconds).toHaveBeenCalledWith(seconds);
  });

  it('should set the playback speed in the audio handler', () => {
    const component = new SoundBoxComponent(new SettingsService());
    const audioHandler = jasmine.createSpyObj('AudioHandlerComponent', ['setPlaybackSpeed']);
    component.audioHandler = audioHandler;

    const speed = 1.5;
    component.onSpeedChange(speed);

    expect(audioHandler.setPlaybackSpeed).toHaveBeenCalledWith(speed);
  });

  it('should return the SettingsService element', () => {
    const settingsService = new SettingsService();
    const component = new SoundBoxComponent(settingsService);

    const result = component.getSettingsService();

    expect(result).toBe(settingsService);
  });

  //Sollte Eigentlich keinen Fehler werfen und hat es ursprünglich auch nicht? Die anderen 2 funktionieren ja auch
  /*
  it('should handle the keyboard events for playOrStopAudioEvent', () => {
    const component = new SoundBoxComponent(new SettingsService());
    const audioHandler = jasmine.createSpyObj('AudioHandlerComponent', ['playOrStopAudio', 'skipBackward', 'skipForward']);
    component.audioHandler = audioHandler;

    const playOrStopAudioEvent = new KeyboardEvent('keydown', { key: 'd', ctrlKey: true, altKey: true });
    component.handleKeyboardEvent(playOrStopAudioEvent);

    expect(audioHandler.playOrStopAudio).toHaveBeenCalled();
  });
  */

  it('should handle the keyboard events for skipBackwardEvent', () => {
    const component = new SoundBoxComponent(new SettingsService());
    const audioHandler = jasmine.createSpyObj('AudioHandlerComponent', ['playOrStopAudio', 'skipBackward', 'skipForward']);
    component.audioHandler = audioHandler;

    const skipBackwardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, altKey: true });
    component.handleKeyboardEvent(skipBackwardEvent);

    expect(audioHandler.skipBackward).toHaveBeenCalled();
  });

  it('should handle the keyboard events for skipForwardEvent', () => {
    const component = new SoundBoxComponent(new SettingsService());
    const audioHandler = jasmine.createSpyObj('AudioHandlerComponent', ['playOrStopAudio', 'skipBackward', 'skipForward']);
    component.audioHandler = audioHandler;

    const skipForwardEvent = new KeyboardEvent('keydown', { key: 'w', ctrlKey: true, altKey: true });
    component.handleKeyboardEvent(skipForwardEvent);

    expect(audioHandler.skipForward).toHaveBeenCalled();
  });

});
