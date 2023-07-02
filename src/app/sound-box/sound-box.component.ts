import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2, HostListener  } from '@angular/core';
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
export class SoundBoxComponent implements AfterViewInit {

  @ViewChild('audioHandler') audioHandler!: AudioHandlerComponent;
  

  @ViewChild('soundButton', { static: false }) soundButton!: ElementRef;
  @ViewChild(SliderPopupComponent) sliderPopup!: SliderPopupComponent;

  @HostListener('window:resize')
  onWindowResize() {
    this.updatePosition();
  }

  updatePosition() {
     const soundButtonElement = this.soundButton.nativeElement;
    const soundButtonRect = soundButtonElement.getBoundingClientRect();

    // Berechnung der gewünschten Position des SliderPopup
    const calculatedTopValue = (soundButtonRect.top + soundButtonRect.height) + 'px';
    const calculatedLeftValue = soundButtonRect.left + 'px';

    const position = {
      top: calculatedTopValue,
      left: calculatedLeftValue
    };

    this.sliderPopup.updateSliderPosition(position);
  }

  test() {
    this.sliderPopup.updateSliderPosition({ top: '10px', left: '20px' });
  }


  ngAfterViewInit() {
    /*
    const sliderWrapper = this.renderer.selectRootElement('.slider-wrapper');
    const parentElement = sliderWrapper.parentElement;
    const parentWidth = parentElement.offsetWidth;
    const sliderWrapperWidth = sliderWrapper.offsetWidth;
    const desiredLeft = parentWidth - sliderWrapperWidth;

    this.renderer.setStyle(sliderWrapper, 'left', `${desiredLeft}px`);
    */



  }

  public isSvg1Active = true;
  public isPopupOpen = false;

  public showMiniWindow = false;
  public audioProgress = 0;

  public isPopoverOpen: boolean = false;

  public volume = 0.5;

  constructor(private router: Router, private renderer: Renderer2) {

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

  togglePopover() {
    this.isPopoverOpen = !this.isPopoverOpen;
  }



  onVolumeChange(volume: number) {
    console.log("PEW");
    console.log(this.volume);
    this.volume = volume;
    //console.log(this.volume);
    this.audioHandler.setVolume(this.volume);
  }




}


