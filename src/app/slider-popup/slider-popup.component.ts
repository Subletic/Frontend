import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slider-popup',
  templateUrl: './slider-popup.component.html',
  styleUrls: ['./slider-popup.component.scss']
})
export class SliderPopupComponent {
  
  @Input() isPopoverOpen: boolean = false;
  public volume = 50;
}
