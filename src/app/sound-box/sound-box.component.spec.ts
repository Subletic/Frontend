import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SoundBoxComponent } from './sound-box.component';
import { AudioHandlerComponent } from './audio-handler/audio-handler.component';
import { SliderPopupComponent } from './slider-popup/slider-popup.component';
import { By } from '@angular/platform-browser';
import { SettingsComponent } from '../settings/settings.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsService } from '../settings/settings.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { DictionaryFsLoaderComponent } from '../start-page/dictionary/dictionary-fs-loader/dictionary-fs-loader.component';
import { ToastrService } from 'ngx-toastr';
import { HidControlService } from '../service/hid-control.service';
import { ConsoleHideService } from '../service/consoleHide.service';
import { Router } from '@angular/router';

describe('SoundBoxComponent', () => {
  let component: SoundBoxComponent;
  let fixture: ComponentFixture<SoundBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MatDividerModule,
      ],
      declarations: [
        SoundBoxComponent,
        AudioHandlerComponent,
        SliderPopupComponent,
        SettingsComponent,
        DictionaryFsLoaderComponent,
      ],
      providers: [{ provide: ToastrService, useValue: ToastrService }],
    }).compileComponents();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoundBoxComponent],
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

    const VOLUME = 0.5;
    component.onVolumeChange(VOLUME);

    expect(component.audioHandler.setVolume).toHaveBeenCalledWith(VOLUME);
  });

  it('should set volume100 on onVolume100Change', () => {
    const VOLUME100 = 50;
    component.onVolume100Change(VOLUME100);

    expect(component.volume100).toEqual(VOLUME100);
  });

  it('should close popups when clicking outside', () => {
    // Arrange
    const mockClickedElement = document.createElement('div');
    const MOCK_SOUNDBUTTON_ELEMENT = document.createElement('div');
    const MOCK_SPEEDBUTTON_ELEMENT = document.createElement('div');
    const MOCK_EVENT = new MouseEvent('click');
    mockClickedElement.appendChild(MOCK_SOUNDBUTTON_ELEMENT);
    mockClickedElement.appendChild(MOCK_SPEEDBUTTON_ELEMENT);
    spyOnProperty(MOCK_EVENT, 'target').and.returnValue(mockClickedElement);
    spyOn(component.soundButton.nativeElement, 'contains').and.returnValue(false);
    spyOn(component.speedButton.nativeElement, 'contains').and.returnValue(false);
    spyOn(component, 'closePopoverAudio');
    spyOn(component, 'closePopoverSpeed');

    // Act
    component.onDocumentMouseDown(MOCK_EVENT);

    // Assert
    expect(component.closePopoverAudio).toHaveBeenCalled();
    expect(component.closePopoverSpeed).toHaveBeenCalled();
  });

  it('should close the speed popover', () => {
    const CONSOLE_HIDE_SERVICE = new ConsoleHideService();
    const SETTINGS_SERVICE = new SettingsService();
    const HID_DEVICES_SERVICE = new HidControlService(CONSOLE_HIDE_SERVICE);
    const component = new SoundBoxComponent(SETTINGS_SERVICE, HID_DEVICES_SERVICE, TestBed.inject(Router));
    component.isSpeedPopoverOpen = true;

    component.closePopoverSpeed();

    expect(component.isSpeedPopoverOpen).toBe(false);
  });

  it('should toggle the speed popover', () => {
    const CONSOLE_HIDE_SERVICE = new ConsoleHideService();
    const SETTINGS_SERVICE = new SettingsService();
    const HID_DEVICES_SERVICE = new HidControlService(CONSOLE_HIDE_SERVICE);
    const component = new SoundBoxComponent(SETTINGS_SERVICE, HID_DEVICES_SERVICE, TestBed.inject(Router));
    component.isSpeedPopoverOpen = false;

    component.switchSpeedPopover();

    expect(component.isSpeedPopoverOpen).toBe(true);

    component.switchSpeedPopover();

    expect(component.isSpeedPopoverOpen).toBe(false);
  });

  it('should open the specified modal', () => {
    const consoleHideService = new ConsoleHideService();
    const component = new SoundBoxComponent(
      new SettingsService(),
      new HidControlService(consoleHideService),
      TestBed.inject(Router),
    );
    const settingsService = jasmine.createSpyObj('SettingsService', ['open']);
    component.setSettingsService(settingsService);

    const MODAL_ID = 'modal1';
    component.openModal(MODAL_ID);

    expect(settingsService.open).toHaveBeenCalledWith(MODAL_ID);
  });

  it('should close the specified modal', () => {
    const consoleHideService = new ConsoleHideService();
    const component = new SoundBoxComponent(
      new SettingsService(),
      new HidControlService(consoleHideService),
      TestBed.inject(Router),
    );
    const settingsService = jasmine.createSpyObj('SettingsService', ['close']);
    component.setSettingsService(settingsService);

    const MODAL_ID = 'modal1';
    component.closeModal(MODAL_ID); // Die Funktion aufrufen

    expect(settingsService.close).toHaveBeenCalledWith(MODAL_ID);
  });

  it('should set the skip seconds in the audio handler', () => {
    const consoleHideService = new ConsoleHideService();
    const component = new SoundBoxComponent(
      new SettingsService(),
      new HidControlService(consoleHideService),
      TestBed.inject(Router),
    );
    const audioHandler = jasmine.createSpyObj('AudioHandlerComponent', ['setSkipSeconds']);
    component.audioHandler = audioHandler;

    const SECONDS = 10;
    component.onSecondsChange(SECONDS);

    expect(audioHandler.setSkipSeconds).toHaveBeenCalledWith(SECONDS);
  });

  it('should set the playback speed in the audio handler', () => {
    const consoleHideService = new ConsoleHideService();
    const component = new SoundBoxComponent(
      new SettingsService(),
      new HidControlService(consoleHideService),
      TestBed.inject(Router)
    );
    const audioHandler = jasmine.createSpyObj('AudioHandlerComponent', ['setPlaybackSpeed']);
    component.audioHandler = audioHandler;

    const SPEED = 1.5;
    component.onSpeedChange(SPEED);

    expect(audioHandler.setPlaybackSpeed).toHaveBeenCalledWith(SPEED);
  });

  it('should return the SettingsService element', () => {
    const CONSOLE_HIDE_SERVICE = new ConsoleHideService();
    const SETTINGS_SERVICE = new SettingsService();
    const HID_DEVICES_SERVICE = new HidControlService(CONSOLE_HIDE_SERVICE);
    const component = new SoundBoxComponent(SETTINGS_SERVICE, HID_DEVICES_SERVICE, TestBed.inject(Router));

    const RESULT = component.getSettingsService();

    expect(RESULT).toBe(SETTINGS_SERVICE);
  });

  it('should handle the keyboard events for skipBackwardEvent', () => {
    const consoleHideService = new ConsoleHideService();
    const component = new SoundBoxComponent(
      new SettingsService(),
      new HidControlService(consoleHideService),
      TestBed.inject(Router),
    );
    const audioHandler = jasmine.createSpyObj('AudioHandlerComponent', [
      'playOrStopAudio',
      'skipBackward',
      'skipForward',
    ]);
    component.audioHandler = audioHandler;
    const skipBackwardSpy = spyOn(component.audioHandler, 'skipBackward');

    const SKIP_BACKWARD_EVENT = new KeyboardEvent('keydown', {
      key: 'r',
      ctrlKey: true,
    });

    component.handleKeyboardEvent(SKIP_BACKWARD_EVENT);

    expect(skipBackwardSpy).toHaveBeenCalled();
  });

  it('should handle the keyboard events for skipForwardEvent', () => {
    const consoleHideService = new ConsoleHideService();
    const component = new SoundBoxComponent(
      new SettingsService(),
      new HidControlService(consoleHideService),
    );
    const audioHandler = jasmine.createSpyObj('AudioHandlerComponent', [
      'playOrStopAudio',
      'skipBackward',
      'skipForward',
    ]);
    component.audioHandler = audioHandler;

    const SKIP_FORWARD_EVENT = new KeyboardEvent('keydown', {
      key: 'Enter',
      ctrlKey: true,
    });

    component.handleKeyboardEvent(SKIP_FORWARD_EVENT);

    expect(skipForwardSpy).toHaveBeenCalled();
  });

  /*
  it('should handle the keyboard events for increaseSpeedEvent', () => {
    const increaseSpeedSpy = spyOn(component as any, 'handleHotkeyIncreaseSpeed');

    const INCREASE_SPEED_EVENT = new KeyboardEvent('keydown', {
      key: 'ArrowUp',
      ctrlKey: true,
    });

    component.handleKeyboardEvent(INCREASE_SPEED_EVENT);

    expect(increaseSpeedSpy).toHaveBeenCalled();
  });

  it('should handle the keyboard events for decreaseSpeedEvent', () => {
    const decreaseSpeedSpy = spyOn(component as any, 'handleHotkeyDecreaseSpeed');

    const DECREASE_SPEED_EVENT = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      ctrlKey: true,
    });

    component.handleKeyboardEvent(DECREASE_SPEED_EVENT);

    expect(decreaseSpeedSpy).toHaveBeenCalled();
  });

  it('should handle the keyboard events for increaseVolumeEvent', () => {
    const increaseVolumeSpy = spyOn(component as any, 'handleHotkeyIncreaseVolume');

    const INCREASE_VOLUME_EVENT = new KeyboardEvent('keydown', {
      key: '9',
      ctrlKey: true,
    });

    component.handleKeyboardEvent(INCREASE_VOLUME_EVENT);

    expect(increaseVolumeSpy).toHaveBeenCalled();
  });

  it('should handle the keyboard events for decreaseVolumeEvent', () => {
    const decreaseVolumeSpy = spyOn(component as any, 'handleHotkeyDecreaseVolume');

    const DECREASE_VOLUME_EVENT = new KeyboardEvent('keydown', {
      key: '8',
      ctrlKey: true,
    });

    component.handleKeyboardEvent(DECREASE_VOLUME_EVENT);

    expect(decreaseVolumeSpy).toHaveBeenCalled();
  });

  it('should handle the keyboard events for playEvent', () => {
    const playSpy = spyOn(component as any, 'handleHotkeyPlay');

    const PLAY_EVENT = new KeyboardEvent('keydown', {
      key: ' ',
      ctrlKey: true,
    });

    component.handleKeyboardEvent(PLAY_EVENT);

    expect(playSpy).toHaveBeenCalled();
  });
  */
});
