import { Component, Input, Output, EventEmitter, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
//
/**
 * Represents a popup that includes a slider for controlling the audio volume.
 */
@Component({
  selector: 'app-slider-popup',
  templateUrl: './slider-popup.component.html',
  styleUrls: ['./slider-popup.component.scss']
})
export class SliderPopupComponent implements OnInit, AfterViewInit {

  //Volume is value between -1 and 1, volume100 between -100 and 100 for slider capability
  @Input() volume = 0;
  private volume100 = 0;

  @Output() volumeChange = new EventEmitter<number>();
  @Output() volume100Change = new EventEmitter<number>();

  @ViewChild('volumeSlider', { static: false }) volumeSlider!: ElementRef<HTMLInputElement>;

  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
    this.setupSlider();
  }

  ngAfterViewInit(): void {
    this.volumeSlider.nativeElement.value = this.volume.toString();
    this.setupSlider();
  }

  /**
   * Sets up the slider so it has a colored bar from bottom to the thumb 
   */
  setupSlider(): void {
    const minVolumeSliderValue = '0';
    const maxVolumeSliderValue = '100';

    document.querySelectorAll<HTMLInputElement>('input[type="range"].slider-progress').forEach((e: HTMLInputElement) => {
      e.style.setProperty('--value', e.value);
      e.style.setProperty('--min', e.min === '' ? minVolumeSliderValue : e.min);
      e.style.setProperty('--max', e.max === '' ? maxVolumeSliderValue : e.max);
      e.addEventListener('input', () => e.style.setProperty('--value', e.value));
    });
  }

  /**
   * Emits info about the changed values in the slider so they can then be send elsewhere.
   * @param event - Input value from slider
   */
  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const conversionBase = 10;
    const volumeRange = 100;
    this.volume100 = parseInt(target.value, conversionBase);
    this.volume = parseInt(target.value, conversionBase) / volumeRange;
    this.volumeChange.emit(this.volume);
    this.volume100Change.emit(this.volume100);
  }

  /**
   * Returns the current volume100 value.
   */
  getVolume100(): number {
    return this.volume100;
  }

  /**
   * Sets new value for volume100 attribute.
   * @param {number} volume100 - New value for volume100 attribute.
   */
  setVolume100(volume100: number): void {
    this.volume100 = volume100;
  }

}
