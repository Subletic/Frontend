import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-slider-popup',
  templateUrl: './slider-popup.component.html',
  styleUrls: ['./slider-popup.component.scss']
})
export class SliderPopupComponent {
  
  @Input() isPopoverOpen: boolean = false;
  @Input() volume: number = 50;
  @Output() volumeChange = new EventEmitter<number>();

  constructor(private elementRef: ElementRef) { }

  updateSliderPosition(position: { top: string, left: string }) {
    

    const sliderWrapper = this.elementRef.nativeElement.querySelector('.slider-wrapper');
    sliderWrapper.style.top = position.top;
    sliderWrapper.style.left = position.left;
  }

  ngOnInit(): void {
    
    this.setupSlider();

  }

  setupSlider(): void {
    document.querySelectorAll<HTMLInputElement>('input[type="range"].slider-progress').forEach((e: HTMLInputElement) => {
      e.style.setProperty('--value', e.value);
      e.style.setProperty('--min', e.min === '' ? '0' : e.min);
      e.style.setProperty('--max', e.max === '' ? '100' : e.max);
      e.addEventListener('input', () => e.style.setProperty('--value', e.value));
    });
  }

  onVolumeChange(event: any) {
    this.volume = parseInt(event.target.value, 10) / 100;
    this.volumeChange.emit(this.volume);
  }

}
