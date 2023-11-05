import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AudioHandlerComponent } from '../audio-handler/audio-handler.component';
import { SettingsService } from '../settings/settings.service';
import { SettingsComponent } from '../settings/settings.component';
import { SliderPopupComponent } from './slider-popup/slider-popup.component';
import { SpeedPopupComponent } from './speed-popup/speed-popup.component';

/**
 * The SoundBoxComponent represents a component that displays the bottom bar of the application.
 * It contains buttons for user interaction with sound and program settings.
 * @param router - An instance of the Angular Router service for navigation.
 */
@Component({
  selector: 'app-sound-box',
  templateUrl: './sound-box.component.html',
  styleUrls: ['./sound-box.component.scss']
})
export class SoundBoxComponent {

  @ViewChild('audioHandler') audioHandler!: AudioHandlerComponent;
  @ViewChild('soundButton', { static: false }) soundButton!: ElementRef;
  @ViewChild('speedButton', { static: false }) speedButton!: ElementRef;

  @ViewChild(SliderPopupComponent) sliderPopup!: SliderPopupComponent;
  @ViewChild(SpeedPopupComponent) speedPopup!: SpeedPopupComponent;
  @ViewChild(SettingsComponent) settingsComponent!: SettingsComponent;

  public isPopupOpen = false;
  public isAudioPopoverOpen = false;
  public volume100 = 0;
  public isAudioPlaying = false;
  public bodyText = '';

  public isSpeedPopoverOpen = false;
  public speedValue = 1;

  constructor(private settingsService: SettingsService) { }

  /**
   * Closes Popups if click outside of popup occurs.
   *
   * @param event - Any click event triggered by user.
   */
  @HostListener('document:click', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    const CLICKED_ELEMENT = event.target as HTMLElement;
    const IS_INSIDE_SOUNDBUTTON = this.soundButton.nativeElement.contains(CLICKED_ELEMENT);
    const IS_INSIDE_SPEEDBUTTON = this.speedButton.nativeElement.contains(CLICKED_ELEMENT);
    if (!IS_INSIDE_SOUNDBUTTON) {
      this.closePopoverAudio();
    }
    if (!IS_INSIDE_SPEEDBUTTON) {
      this.closePopoverSpeed();
    }
  }

  /**
   * Shortcuts for play/pause, skipBack and skipForwards.
   *
   * @param event - Any key event triggered by user.
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.altKey) {
      if (event.key === 'd') {
        this.audioHandler.togglePlayback();
        this.isAudioPlaying = this.audioHandler.getIsAudioPlaying();
        event.preventDefault();
      } else if (event.key === 'y') {
        this.audioHandler.skipBackward();
        event.preventDefault();
      } else if (event.key === 'w') {
        this.audioHandler.skipForward();
        event.preventDefault();
      }
    }
  }

  /**
   * Handles playButton press. Calls playOrStopAudio() in audiohandler and
   * switches isAudioPlaying for Icon-Change
   */
  playButton(): void {
    this.audioHandler.togglePlayback();
    this.isAudioPlaying = this.audioHandler.getIsAudioPlaying();
  }

  /**
   * Calls skipBackward() function in audioHandler.
   */
  skipBackwardButton(): void {
    this.audioHandler.skipBackward();
  }

  /**
   * Calls skipForward() function in audioHandler.
   */
  skipForwardButton(): void {
    this.audioHandler.skipForward();
  }

  /**
   * Opens Settings-Window
   * @param {string} id - Id of the Window to open.
   */
  openModal(id: string): void {
    this.settingsService.open(id);
  }

  /**
   * Closes Settings-Window
   * @param {string} id - Id of the Window to close.
   */
  closeModal(id: string): void {
    this.settingsService.close(id);
  }

  /**
   * Switches isAudioPopoverOpen Boolean to the negated value.
   */
  switchPopoverAudio(): void {
    this.isAudioPopoverOpen = !this.isAudioPopoverOpen;
  }

  /**
   * Sets isSpeedPopoverOpen to false, causing the Speed Popover to close.
   */
  closePopoverAudio(): void {
    this.isAudioPopoverOpen = false;
  }

  /**
   * Switches isSpeedPopoverOpen Boolean to the negated value.
   */
  switchSpeedPopover(): void {
    this.isSpeedPopoverOpen = !this.isSpeedPopoverOpen;
  }

  /**
   * Sets isSpeedPopoverOpen to false, causing the Speed Popover to close.
   */
  closePopoverSpeed(): void {
    this.isSpeedPopoverOpen = false;
  }

  /** Calls setVolume Function in audioHandler with volume number between -1 and 1.
   * @param {number} volume - The new volume value.
   */
  onVolumeChange(volume: number): void {
    this.audioHandler.setVolume(volume);
  }

  /**
   * Sets the number of seconds to skip in the audio handler.
   * @param {number} seconds - The number of seconds to skip.
   */
  onSecondsChange(seconds: number): void {
    this.audioHandler.setSkipSeconds(seconds);
  }

  /**
   * Safes the inital volume number between -100 and 100,
   * so the next slider can be instantiated with the last-current-value of the old one.
   */
  onVolume100Change(volume100: number): void {
    this.volume100 = volume100;
  }

  /**
   * Calls setPlaybackSpeed Function in AudioHandler with emitted speedValue from speed-popup.
   */
  onSpeedChange(speed: number): void {
    this.speedValue = speed;
    this.audioHandler.setPlaybackSpeed(this.speedValue);
  }

  /**
   * Returns the SettingsService Element of this Instance
   */
  getSettingsService(): SettingsService {
    return this.settingsService;
  }

  /**
   * Sets the settingService of this instance
   */
  setSettingsService(settingsService: SettingsService): void {
    this.settingsService = settingsService;
  }

}