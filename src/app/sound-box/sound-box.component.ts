import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AudioHandlerComponent } from '../audio-handler/audio-handler.component';
import { SliderPopupComponent } from './slider-popup/slider-popup.component';


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
  @ViewChild(SliderPopupComponent) sliderPopup!: SliderPopupComponent;

  public isSvg1Active = true;
  public isPopupOpen = false;

  public isPopoverOpen = false;

  public volume100 = 0;

  constructor(private router: Router, private elementRef: ElementRef) {}

  @HostListener('window:resize')
  onWindowResize() {
    this.updatePosition();
  }

  @HostListener('document:click', ['$event'])
  onDocumentMouseDown(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const isInsideSoundButton = this.soundButton.nativeElement.contains(clickedElement);
    if (!isInsideSoundButton) {
      this.closePopoverAudio();
    } 
  }

  /** Updates the position of the slider Pop-Up so it's always above the sound button.
   * 
   */
  updatePosition() {
    this.sliderPopup.updateSliderPosition();
  }

  playButton() {
    this.isSvg1Active = !this.isSvg1Active;
    this.audioHandler.playOrStopAudio();
  }

  handleButtonClick() {
    console.log("hallo");
    this.router.navigate(['/weitereSeite']);
  }

  skipBackwardButton() {
    this.audioHandler.skipBackward();
  }

  skipForwardButton() {
    this.audioHandler.skipForward();
  }

  changePlaybackSpeedButton() {
    this.audioHandler.setPlaybackSpeed(0.7);
  }

  openPopup() {
    this.isPopupOpen = true;
  }

  togglePopoverAudio() {
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  closePopoverAudio() {
    this.isPopoverOpen = false;
  }

  /** Calls setVolume Function in audioHandler with volume number between -1 and 1. 
   * 
   */
  onVolumeChange(volume: number) {
    this.audioHandler.setVolume(volume);
  }

  /**
   * Safes the inital volume number between -100 and 100, 
   * so the next slider can be instantiated with the last-current-value of the old one.
   */
  onVolume100Change(volume100: number) {
    this.volume100 = volume100;
  }

}


