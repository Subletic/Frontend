import { Component, Input, Output, EventEmitter, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';

/**
 * Represents a popup that includes a slider for controlling the audio volume.
 */
@Component({
  selector: 'app-slider-popup',
  templateUrl: './slider-popup.component.html',
  styleUrls: ['./slider-popup.component.scss']
})
export class SliderPopupComponent implements OnInit, AfterViewInit  {

  @Input() volume!: number;
  private volume100 = 0;

  @Output() volumeChange = new EventEmitter<number>();
  @Output() volume100Change = new EventEmitter<number>();

  @ViewChild('volumeSlider', { static: false }) volumeSlider!: ElementRef<HTMLInputElement>;

  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
    this.setupSlider();
  }

  ngAfterViewInit() {
    this.volumeSlider.nativeElement.value = this.volume.toString();
    this.setupSlider();
  }

  /**
  * Updates the position of the slider based on the position of the sound button.
  */
  updateSliderPosition() {
    const soundButtonContainer = this.elementRef.nativeElement.querySelector('.sound-button-container');
    if (!soundButtonContainer) return;
    const sliderWrapper = this.elementRef.nativeElement.querySelector('.slider-wrapper');
  
    const soundButtonRect = soundButtonContainer.getBoundingClientRect();
    const soundButtonPosition = {
      top: `${soundButtonRect.top}px`,
      left: `${soundButtonRect.left}px`
    };
  
    sliderWrapper.style.setProperty('--slider-left', soundButtonPosition.left);
    sliderWrapper.style.setProperty('--slider-top', soundButtonPosition.top);
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
   * Emits info about the changed values in the slider so they can then be send elsewhere.
   * @param event - Input value from slider
   */
  onVolumeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.volume100 = parseInt(target.value, 10);
    this.volume = parseInt(target.value, 10) / 100;
    this.volumeChange.emit(this.volume);
    this.volume100Change.emit(this.volume100);
  }

}
