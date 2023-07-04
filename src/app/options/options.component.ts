import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-options-popup',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class PopupComponent {
  @Input() top = 0;
  @Input() left = 0;

  inputValue = '';
}
