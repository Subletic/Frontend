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
   * Sets up the slider so it has a colored bar from bottom to the thumb 
   */
  setupSlider(): void {
    document.querySelectorAll<HTMLInputElement>('input[type="range"].slider-progress').forEach((e: HTMLInputElement) => {
      e.style.setProperty('--value', e.value);
      e.style.setProperty('--min', e.min === '' ? '0' : e.min);
      e.style.setProperty('--max', e.max === '' ? '100' : e.max);
      e.addEventListener('input', () => e.style.setProperty('--value', e.value));
    });
  }




  /**
   * Emits info about the changed value of the speed value so it can then be send elsewhere.
   * @param speed - Input value
   */
  emitNewSpeed(speed: number) {
    this.speedValue = speed;
    console.log(this.speedValue);
    this.speedChange.emit(this.speedValue);
    console.log("Emitted Speed in speed-popup: " + this.speedValue);
  }

}
