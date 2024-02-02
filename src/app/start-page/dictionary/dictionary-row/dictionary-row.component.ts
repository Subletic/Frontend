import { AfterViewInit, Component, Input, EventEmitter, Output } from '@angular/core';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';

/**
 * Component represents a single row of the dictionary editor, consisting of a
 * content and a sounds_like box and a button to delete said row.
 */
@Component({
  selector: 'app-dictionary-row',
  templateUrl: './dictionary-row.component.html',
  styleUrls: ['./dictionary-row.component.scss'],
})
export class DictionaryRowComponent implements AfterViewInit {
  @Input() rowData: additional_vocab;
  @Output() deleteRow: EventEmitter<void> = new EventEmitter<void>();
  @Output() changedRow: EventEmitter<void> = new EventEmitter<void>();

  content_copy: string | undefined;

  sounds_like_copy: string[] | undefined;

  constructor() {
    this.rowData = new additional_vocab('', ['']);

    this.content_copy = this.rowData.content;

    if (!this.rowData.sounds_like) return;
    this.sounds_like_copy = this.rowData.sounds_like;
  }

  ngAfterViewInit(): void {
    this.content_copy = this.rowData.content;

    if (!this.rowData.sounds_like) return;
    this.sounds_like_copy = this.rowData.sounds_like;
  }

  /**
   * Maps the changes in the editable spans for content and sounds_like to the data structure of
   * a single additional_vocab.
   */
  onContentChange(property: keyof additional_vocab, event: Event): void {
    const TARGET = event.target as HTMLDivElement;

    if (event instanceof KeyboardEvent && event.key === ' ') {
      event.preventDefault(); // Verhindere die Standardaktion der Leertaste
      return;
    }
    
    let CONTENT = TARGET.textContent;

    if (!CONTENT) return;

    if (property === 'sounds_like') {
      this.rowData[property] = CONTENT.split(',').map((value: string) => value.trim());
      console.log(this.rowData[property]);
    } else {
      CONTENT = CONTENT.replace(/[,]/g, '').trim();
      this.rowData[property] = CONTENT;
      //this.content_copy = CONTENT;
      console.log(this.rowData[property]);
    }

    this.changedRow.emit();
  }

  /**
   * Emits the call to the editor to delete this row from the datastructure.
   */
  onDeleteRow(): void {
    this.deleteRow.emit();
  }
}
