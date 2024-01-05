import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-continue-popup',
  templateUrl: './continue-popup.component.html',
  styleUrls: ['./continue-popup.component.scss'],
})
export class ContinuePopupComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() continue = new EventEmitter<boolean>();

  /**
   * Closes the export popup.
   */
  close() {
    this.closed.emit();
  }

  continueToEditor() {
    this.continue.emit();
  }
}
