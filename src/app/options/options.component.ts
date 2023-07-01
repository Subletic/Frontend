import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-options-popup',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class PopupComponent {
  @Input() top = 0;
  @Input() left = 0;
  @Output() close = new EventEmitter<void>();

  inputValue = '';

  closePopup() {
    this.close.emit();
  }
}
