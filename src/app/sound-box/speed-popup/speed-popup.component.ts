import { Component, Input, Output, EventEmitter, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';

/**
 * Represents a popup that includes a slider for controlling the audio volume.
 */
@Component({
  selector: 'app-speed-popup',
  templateUrl: './speed-popup.component.html',
  styleUrls: ['./speed-popup.component.scss']
})
export class SpeedPopupComponent implements AfterViewInit  {

  @Input() speedValue!: number;

  @Output() speedChange = new EventEmitter<number>();

  constructor(public elementRef: ElementRef) { }

  ngAfterViewInit() {
    
    //aktuelles Element sollte eventuell grauen hintergrundkreis bekommen oder so?
  
  }

  /**
  * Updates the position of the slider based on the position of the sound button.
  */
  updateElementPosition() {
    const speedButtonContainer = this.elementRef.nativeElement.querySelector();
    if (!speedButtonContainer) return;
    const speedWrapper = this.elementRef.nativeElement.querySelector('.speed-wrapper');
  
    const speedButtonRect = speedButtonContainer.getBoundingClientRect();
    const speedButtonPosition = {
      top: `${speedButtonRect.top}px`,
      left: `${speedButtonRect.left}px`
    };
  
    speedWrapper.style.setProperty('--slider-left', speedButtonPosition.left);
    speedWrapper.style.setProperty('--slider-top', speedButtonPosition.top);
  }

  /**
   * Emits info about the changed value of the speed value so it can then be send elsewhere.
   * @param speed - Input value
   */
  emitNewSpeed(speed: number) {
    this.speedValue = speed;
    this.speedChange.emit(this.speedValue);
  }

}
