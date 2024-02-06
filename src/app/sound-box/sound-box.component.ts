import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AudioHandlerComponent } from './audio-handler/audio-handler.component';
import { HidControlService } from '../service/hid-control.service';
import { SettingsService } from '../settings/settings.service';
import { SettingsComponent } from '../settings/settings.component';
import { SliderPopupComponent } from './slider-popup/slider-popup.component';
import { SpeedPopupComponent } from './speed-popup/speed-popup.component';
import { Router } from '@angular/router';

/**
 * The SoundBoxComponent represents a component that displays the bottom bar of the application.
 * It contains buttons for user interaction with sound and program settings.
 * @param router - An instance of the Angular Router service for navigation.
 */
@Component({
  selector: 'app-sound-box',
  templateUrl: './sound-box.component.html',
  styleUrls: ['./sound-box.component.scss'],
})
export class SoundBoxComponent {
  @ViewChild('audioHandler') audioHandler!: AudioHandlerComponent;
  @ViewChild('soundButton', { static: false }) soundButton!: ElementRef;
  @ViewChild('speedButton', { static: false }) speedButton!: ElementRef;

  @ViewChild(SliderPopupComponent) sliderPopup!: SliderPopupComponent;
  @ViewChild(SpeedPopupComponent) speedPopup!: SpeedPopupComponent;
  @ViewChild(SettingsComponent) settingsComponent!: SettingsComponent;

  @ViewChild('buttonImage', { static: false }) playButtonImage!: ElementRef;
  @ViewChild('buttonImage3', { static: false }) forwardsButtonImage!: ElementRef;
  @ViewChild('buttonImage2', { static: false }) backwardsButtonImage!: ElementRef;

  public isPopupOpen = false;
  public isAudioPopoverOpen = false;
  public volume100 = 0;
  public volume = 0;
  public isAudioPlaying = false;
  public bodyText = '';

  public isKeyDown = false;
  public buttonImage2Src = 'assets/back.svg';
  public buttonImage3Src = 'assets/forward.svg';

  public isSpeedPopoverOpen = false;
  public speedValue = 1;

  constructor(
    private settingsService: SettingsService,
    private hidControlService: HidControlService,
    private router: Router,
  ) {
    hidControlService.configureDevices(
      () => {
        this.handlePlayButtonPress();
      },
      () => {
        this.handleSkipForwardButtonPress();
      },
      () => {
        this.handleSkipBackwardButtonPress();
      },
    );
  }

  /**
   * Closes Popups if click outside popup occurs.
   *
   * @param event - Any click event triggered by user.
   */
  @HostListener('document:click', ['$event'])
  public onDocumentMouseDown(event: MouseEvent): void {
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
   * Opens the FAQ in a new tab
   *
   */
  public toggleFaq(): void {
    const componentUrl = this.router.serializeUrl(this.router.createUrlTree(['/FAQ']));

    window.open(componentUrl, '_blank');
  }

  /**
   * Shortcuts for hotkeys defined in hotkey-menue.
   *
   * Keydown events mostly trigger relevant event and SVG-switch,
   * keyup events only partly change SVG Images back.
   *
   * @param event - Any key event triggered by user.
   */
  @HostListener('document:keydown', ['$event'])
  @HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey) {
      switch (event.key) {
        case ' ':
          this.handleHotkeyPlay(event);
          break;
        case 'r':
          this.handleHotkeySkipBackward(event);
          break;
        case 'Enter':
          this.handleHotkeySkipForward(event);
          break;
        case 'ArrowUp':
          this.handleHotkeyIncreaseSpeed(event);
          break;
        case 'ArrowDown':
          this.handleHotkeyDecreaseSpeed(event);
          break;
        case '9':
          this.handleHotkeyIncreaseVolume(event);
          break;
        case '8':
          this.handleHotkeyDecreaseVolume(event);
          break;
      }
    }
  }

  /**
   * Handles the play/pause shortcut.
   * @param event Key event triggered by user. Can be keydown or keyup event.
   */
  private handleHotkeyPlay(event: KeyboardEvent): void {
    if (event.type === 'keydown') {
      this.handlePlayButtonPress();
      event.preventDefault();
      this.isAudioPlaying
        ? (this.playButtonImage.nativeElement.src = 'assets/pauseOnClick.svg')
        : (this.playButtonImage.nativeElement.src = 'assets/playOnClick.svg');
    } else if (event.type === 'keyup') {
      this.isAudioPlaying
        ? (this.playButtonImage.nativeElement.src = 'assets/pause.svg')
        : (this.playButtonImage.nativeElement.src = 'assets/play.svg');
    }
  }

  /**
   * Handles the skip backward shortcut.
   * @param event Key event triggered by user.
   */
  private handleHotkeySkipBackward(event: KeyboardEvent): void {
    if (event.type === 'keydown') {
      this.handleSkipBackwardButtonPress();
      event.preventDefault();
      this.backwardsButtonImage.nativeElement.src = 'assets/backOnClick.svg';
    } else if (event.type === 'keyup') {
      this.backwardsButtonImage.nativeElement.src = 'assets/back.svg';
    }
  }

  /**
   * Handles the skip forward shortcut.
   * @param event Key event triggered by user.
   */
  private handleHotkeySkipForward(event: KeyboardEvent): void {
    if (event.type === 'keydown') {
      this.handleSkipForwardButtonPress();
      event.preventDefault();
      this.forwardsButtonImage.nativeElement.src = 'assets/forwardOnClick.svg';
    } else if (event.type === 'keyup') {
      this.forwardsButtonImage.nativeElement.src = 'assets/forward.svg';
    }
  }

  /**
   * Handles the increase speed shortcut.
   * @param event Key event triggered by user.
   */
  private handleHotkeyIncreaseSpeed(event: KeyboardEvent): void {
    if (event.type != 'keydown') return;
    if (this.speedValue >= 1.3) return;
    this.speedValue += 0.1;
    this.onSpeedChange(this.speedValue);
    event.preventDefault();
  }

  /**
   * Handles the decrease speed shortcut.
   * @param event Key event triggered by user.
   */
  private handleHotkeyDecreaseSpeed(event: KeyboardEvent): void {
    if (event.type != 'keydown') return;
    // 0.8 - 0.1 hat Rundungsfehler, deswegen der leicht höhere Grenzwert
    if (this.speedValue <= 0.7001) return;
    this.speedValue -= 0.1;
    this.onSpeedChange(this.speedValue);
    event.preventDefault();
  }

  /**
   * Handles the increase volume shortcut.
   * @param event Key event triggered by user.
   */
  private handleHotkeyIncreaseVolume(event: KeyboardEvent): void {
    if (event.type != 'keydown') return;
    if (!(this.volume > 0.8 || this.volume < -1)) {
      this.volume += 0.2;
      this.volume100 += 20;
    } else {
      this.volume = 1;
      this.volume100 = 100;
    }
    this.onVolumeChange(this.volume);
    event.preventDefault();
  }

  /**
   * Handles the decrease volume shortcut.
   * @param event Key event triggered by user.
   */
  private handleHotkeyDecreaseVolume(event: KeyboardEvent): void {
    if (event.type != 'keydown') return;
    if (!(this.volume > 1 || this.volume <= -0.8)) {
      this.volume -= 0.2;
      this.volume100 -= 20;
    } else {
      this.volume = -1;
      this.volume100 = -100;
    }
    this.onVolumeChange(this.volume);
    event.preventDefault();
  }

  /**
   * Handles playButton press. Calls playOrStopAudio() in audiohandler and
   * switches isAudioPlaying for Icon-Change
   */
  public handlePlayButtonPress(): void {
    this.audioHandler.togglePlayback().then((audioPlaying) => (this.isAudioPlaying = audioPlaying));
  }

  /**
   * Calls skipBackward() function in audioHandler.
   */
  public handleSkipBackwardButtonPress(): void {
    this.audioHandler.skipBackward();
  }

  /**
   * Calls skipForward() function in audioHandler.
   */
  public handleSkipForwardButtonPress(): void {
    this.audioHandler.skipForward();
  }

  /**
   * Opens Settings-Window
   * @param {string} id - Id of the Window to open.
   */
  public openModal(id: string): void {
    this.settingsService.open(id);
  }

  /**
   * Closes Settings-Window
   * @param {string} id - Id of the Window to close.
   */
  public closeModal(id: string): void {
    this.settingsService.close(id);
  }

  /**
   * Switches isAudioPopoverOpen Boolean to the negated value.
   */
  public switchPopoverAudio(): void {
    this.isAudioPopoverOpen = !this.isAudioPopoverOpen;
  }

  /**
   * Sets isSpeedPopoverOpen to false, causing the Speed Popover to close.
   */
  public closePopoverAudio(): void {
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
  public closePopoverSpeed(): void {
    this.isSpeedPopoverOpen = false;
  }

  /** Calls setVolume Function in audioHandler with volume number between -1 and 1.
   * @param {number} volume - The new volume value.
   */
  public onVolumeChange(volume: number): void {
    this.volume = volume;
    this.audioHandler.setVolume(volume);
  }

  /**
   * Sets the number of seconds to skip in the audio handler.
   * @param {number} seconds - The number of seconds to skip.
   */
  public onSecondsChange(seconds: number): void {
    this.audioHandler.setSkipSeconds(seconds);
  }

  /**
   * Safes the inital volume number between -100 and 100,
   * so the next slider can be instantiated with the last-current-value of the old one.
   */
  public onVolume100Change(volume100: number): void {
    this.volume100 = volume100;
  }

  /**
   * Calls setPlaybackSpeed Function in AudioHandler with emitted speedValue from speed-popup.
   */
  public onSpeedChange(speed: number): void {
    this.speedValue = speed;
    this.audioHandler.setPlaybackSpeed(this.speedValue);
  }

  /**
   * Returns the SettingsService Element of this Instance
   */
  public getSettingsService(): SettingsService {
    return this.settingsService;
  }

  /**
   * Sets the settingService of this instance
   */
  public setSettingsService(settingsService: SettingsService): void {
    this.settingsService = settingsService;
  }

  /**
   * Initializes the audio contexts.
   * @param bufferLengthInMinutes
   */
  public initAudioContexts(bufferLengthInMinutes: number) {
    this.audioHandler.setBufferLength(bufferLengthInMinutes);
    this.audioHandler.initAudioContexts();
  }
}
