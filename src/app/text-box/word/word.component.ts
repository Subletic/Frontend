import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output,
  OnInit,
} from '@angular/core';
import { WordToken } from '../../data/wordToken/wordToken.model';

@Component({
  selector: 'app-word-component',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent implements OnInit, AfterViewInit {
  @Input() word!: WordToken;
  @Input() id!: number;
  @Input() idParent!: number;
  spanID!: string;
  wordPrint!: string;

  @Output() dataUpdate: EventEmitter<{
    changedWord: WordToken;
    idOfEmitter: number;
  }> = new EventEmitter<{ changedWord: WordToken; idOfEmitter: number }>();
  @Output() newWordAfter: EventEmitter<{
    wordAfter: string;
    idOfEmitter: number;
  }> = new EventEmitter<{ wordAfter: string; idOfEmitter: number }>();

  @Output() addSelfToPrevWord: EventEmitter<{ idOfEmitter: number }> =
    new EventEmitter<{ idOfEmitter: number }>();
  @Output() deleteSelf: EventEmitter<{ idOfEmitter: number }> =
    new EventEmitter<{ idOfEmitter: number }>();

  @ViewChild('self', { static: true }) selfRef!: ElementRef;

  ngOnInit(): void {
    this.spanID = `${this.idParent}_${this.id}`;
    this.wordPrint = this.word.word;
  }

  ngAfterViewInit(): void {
    this.setEventListeners();
  }

  public handleKeydownEvent(event: KeyboardEvent): void {
    const SELECTED_SPAN = event.target as HTMLElement;
    const CURRENT_TEXT = SELECTED_SPAN.textContent;
    const CURSOR_POSITION = window.getSelection()?.getRangeAt(0)?.startOffset;
    const IS_IN_FULL_SELECTION =
      window.getSelection()?.toString().length === CURRENT_TEXT?.length;

    if (event.code === 'Space') {
      this.handleSpacePress(SELECTED_SPAN, CURSOR_POSITION, event);
      return;
    }

    if (CURSOR_POSITION === 0 && event.key === 'Backspace') {
      this.handleBackspacePressAtStart(IS_IN_FULL_SELECTION);
      return;
    }
  }

  /**
   * This function handles the case when the Space key is pressed inside a word.
   * Splits the current word into two words at the cursor position.
   * If the text before the cursor is not empty, a new
   * word is inserted after the current word in the speechbubble (via emitting call).
   *
   * @param selectedSpan - The event target as an HTMLElement
   * @param cursorPosition - The cursor position at the time of the call
   * @param event - The keyboard event triggered by user.
   */
  public handleSpacePress(
    selectedSpan: HTMLElement,
    cursorPosition: number | undefined,
    event: KeyboardEvent,
  ): void {
    const WORD_BEFORE_CURSOR = this.selfRef.nativeElement.textContent.substring(
      0,
      cursorPosition,
    );
    const WORD_AFTER_CURSOR =
      this.selfRef.nativeElement.textContent.substring(cursorPosition);

    if (WORD_BEFORE_CURSOR.trim() == '') return;

    this.word.word = WORD_BEFORE_CURSOR;
    this.word.confidence = 1;

    this.dataUpdate.emit({ changedWord: this.word, idOfEmitter: this.id });
    this.newWordAfter.emit({
      wordAfter: WORD_AFTER_CURSOR,
      idOfEmitter: this.id,
    });

    selectedSpan.textContent = this.word.word;

    event.preventDefault();
  }

  /**
     * This function handles the case when the Backspace key is pressed at the start of a word.
     * Word is in full selection -> Delete as a whole
     * Previous Word exists -> Merges with previous Word

    * @param isInFullSelection - Boolean that states if the currentWort is fully selected by user
    * 
    * @pre Function should be called when backspace is pressed at start of a word
    */
  public handleBackspacePressAtStart(isInFullSelection: boolean): void {
    if (isInFullSelection) {
      this.deleteSelf.emit({ idOfEmitter: this.id });
      return;
    }

    this.addSelfToPrevWord.emit({ idOfEmitter: this.id });
    return;
  }

  /**
   * Sets event listeners for the textbox to enable methods that use input data.
   */
  private setEventListeners(): void {
    this.selfRef.nativeElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        this.handleKeydownEvent(event);
      },
    );

    /**
     * The keydown function doesn't cover the latest change of the .textContent
     * Attribute of a span, because typescript prioritises the keydown EventListener instead of
     * updating the .textContent of the span first.
     * Therefore, there needs to be a keyup listener that updates
     * the data structure so the words are always correct when send
     * to backend. (keydown > update .textContent > keyup)
     */
    this.selfRef.nativeElement.addEventListener('keyup', () => {
      this.updateWord();
    });
  }

  /**
   * Updates the word the event is about in the data structure.
   *
   * @param event - Any KeyboardEvent
   */
  public updateWord(): void {
    this.word.word = this.selfRef.nativeElement.textContent;
    this.dataUpdate.emit({ changedWord: this.word, idOfEmitter: this.id });
  }
}
