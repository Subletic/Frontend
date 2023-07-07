import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

/**
 * Represents a popup that includes button for controlling the audio speed.
 */
@Component({
  selector: 'app-speed-popup',
  templateUrl: './speed-popup.component.html',
  styleUrls: ['./speed-popup.component.scss']
})
export class SpeedPopupComponent  {

  @Input() speedValue!: number;
  @Output() speedChange = new EventEmitter<number>();

  constructor(public elementRef: ElementRef) { }

  /**
   * Emits info about the changed value of the speed value so it can then be send elsewhere.
   * @param speed - Input value
   */
  emitNewSpeed(speed: number) {
    this.speedValue = speed;
    this.speedChange.emit(this.speedValue);
  }
  
}
