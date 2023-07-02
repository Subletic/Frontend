import { Component, ViewChild, ElementRef, HostListener  } from '@angular/core';
import { Router } from '@angular/router';
import { AudioHandlerComponent } from '../audio-handler/audio-handler.component';

import { SliderPopupComponent } from '../slider-popup/slider-popup.component';


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

  @HostListener('window:resize')
  onWindowResize() {
    this.updatePosition();
  }


  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const clickedElement = event.target as HTMLElement;
  const isInsideSoundButton = this.soundButton.nativeElement.contains(clickedElement);
  const isInsideSliderPopup = this.sliderPopup.elementRef.nativeElement.contains(clickedElement);
  
  if (!isInsideSoundButton && !isInsideSliderPopup) {
    this.closePopoverAudio();
  }
}



  /*
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const isInsideSoundButton = this.soundButton.nativeElement.contains(clickedElement);
    const isInsideSliderPopup = this.sliderPopup.elementRef.nativeElement.contains(clickedElement);
  
    if (!isInsideSoundButton && !isInsideSliderPopup) {
      this.closePopoverAudio();
    }
  }
  */

  public isSvg1Active = true;
  public isPopupOpen = false;

  public showMiniWindow = false;
  public audioProgress = 0;

  public isPopoverOpen: boolean = false;

  public volume = 0.5;

  constructor(private router: Router, private elementRef: ElementRef) {

  }

  /** Updates the position of the slider Pop-Up so it's always above the sound button.
   * 
   */
  updatePosition() {
    const soundButtonElement = this.soundButton.nativeElement;
    const soundButtonRect = soundButtonElement.getBoundingClientRect();

    const calculatedTopValue = (soundButtonRect.top + soundButtonRect.height) + 'px';
    const calculatedLeftValue = soundButtonRect.left + 'px';

    const position = {
      top: calculatedTopValue,
      left: calculatedLeftValue
    };

    this.sliderPopup.updateSliderPosition(position);
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

  openMiniWindow() {
    this.showMiniWindow = true;
  }

  updateAudioProgress(progress: number) {
    this.audioProgress = progress;
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

  onVolumeChange(volume: number) {
    this.volume = volume;
    this.audioHandler.setVolume(this.volume);
  }

}


