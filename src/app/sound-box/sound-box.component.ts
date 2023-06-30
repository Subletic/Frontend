import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AudioHandlerComponent } from '../audio-handler/audio-handler.component';

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
  public isSvg1Active = true;
  public isPopupOpen = false;

  constructor(private router: Router) {}

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

}


