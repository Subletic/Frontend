import { Component, AfterViewInit, ViewChild, ElementRef, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { WordToken } from '../data/wordToken/wordToken.model';
import { SpeechBubble } from '../data/speechBubble/speechBubble.model';
import { Node } from '../data/linkedList/node.model';

/**
 * The TextBoxComponent represents a component that handles the SpeechBubble data.
 * It provides methods to generate and manipulate the content of a text box.
 * To directly access and adress every word, Spans are used instead
 * of a typical textbox with a single String.
 * The data inside the TextBox is directly connected to the data-structure of the speechBubbles.
 */
@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextBoxComponent implements AfterViewInit {

  @ViewChild('textbox', { static: true }) textboxRef!: ElementRef;
  @Input() speechBubble!: SpeechBubble;
  @ViewChild('textboxContainer', { static: true }) textboxContainerRef!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * After Init of View, generates the Words from the data structure
   * inside the textbox. Adds event listeners to the textbox and generates
   * an empty words in case that the list of words is empty.
   */
  ngAfterViewInit(): void {
    const textbox = this.textboxRef.nativeElement;

    if (this.speechBubble.words.head == null) {
      this.speechBubble.words.add(new WordToken('', 1, 1, 1, 1));
    }

    this.setEventListeners(textbox);

    this.adjustCurrentWordInterval();

    this.textboxContainerRef.nativeElement.id = `${this.speechBubble.id}`;
  }

  /**
   * Prints info about a certain textbox when its hovered over.
   * 
   * @param event - Any MouseEvent on the Textbox
   */
  public logInfoAboutTextbox(event: MouseEvent): void {
    const TARGET = event.target as HTMLElement;
    if (!(TARGET.tagName === 'SPAN')) return;
    const HOVERED_WORD = TARGET.textContent;
    const ID_PART = TARGET.id.split('_');
    const ID = Number(ID_PART[1]);
    const CURRENT_WORD = this.speechBubble.words.getDataById(ID);

    console.log('Word: ' + HOVERED_WORD + ', ID: ' + ID);
    console.log('Current Word: ', CURRENT_WORD);
    console.log('Print Text:', this.speechBubble.printText());
  }

  /**
   * This function handles the case when the Backspace key is pressed at the start of a word.
   * Word is in full selection -> Delete as a whole
   * Previous Word exists -> Merges with previous Word
   * PrevWord doesn't exist -> Merges with next Word
   * 
   * @param selectedSpan - The event target as an HTMLElement
   * @param currentText - The textContent of the selected Span
   * @param cursorPosition - The cursor position at the time of the call
   * @param isInFullSelection - Boolean that states if the currentWort is fully selected by user
   * @param event - The keyboard event triggered by user.
   * 
   * @pre Function should be called when backspace is pressed at start of a word
   */
  public handleBackspacePressAtStart(selectedSpan: HTMLElement, currentText: string | null, isInFullSelection: boolean, spanId: string, event: KeyboardEvent): void {
    const PREV_SPAN = selectedSpan.previousElementSibling as HTMLSpanElement;
    if (isInFullSelection) {
      this.isInFullSelectionDeletion(selectedSpan, spanId, event);
      return;
    }

    if (PREV_SPAN && !PREV_SPAN.getAttribute('id') != null) {
      this.mergeWithPreviousWord(selectedSpan, currentText, PREV_SPAN, event);
      return;
    }

    const nextSpan = selectedSpan.nextElementSibling as HTMLSpanElement;
    if (nextSpan) {
      this.mergeWithFollowingWord(selectedSpan, currentText, nextSpan, event);
      return;
    }
  }

  /**
   * Handles the case that the whole word is in selection and backspace is pressed.
   * Deletes the currentWord in the data structure.
   * 
   * @param selectedSpan - The event target as an HTMLElement
   * @param spanId - Id of the selectedSpan
   * @param event - The keyboard event triggered by user.
   */
  public isInFullSelectionDeletion(selectedSpan: HTMLElement, spanId: string, event: KeyboardEvent): void {
    const ID_PART = spanId.split('_');
    const ID = Number(ID_PART[1]);
    const currentWord = this.speechBubble.words.getDataById(ID);
    if (!currentWord) return
    currentWord.word = '';
    this.speechBubble.words.remove(currentWord);
    selectedSpan.remove();
    event.preventDefault();
    return;
  }

  /**
   * Merges the current Word with the previous one,
   * both within the data structure as well as for the spans.
   * 
   * @param selectedSpan - The event target as an HTMLElement
   * @param currentText - The textContent of the selected Span
   * @param prevSpan - The previous Span to merge into
   * @param event - The keyboard event triggered by user.
   * 
   * @pre There needs to be a previous word
   */
  public mergeWithPreviousWord(selectedSpan: HTMLElement, currentText: string | null, prevSpan: HTMLSpanElement, event: KeyboardEvent): void {
    const ID_PART_PREV_WORD = prevSpan.id.split('_');
    const ID_PREV_WORD = Number(ID_PART_PREV_WORD[1]);
    const prevWord = this.speechBubble.words.getDataById(ID_PREV_WORD);
    if (!prevWord) return;
    prevWord.word += currentText;
    if (!prevSpan.getAttribute('id')) return;
    const ID_PART = selectedSpan.id.split('_');
    const ID = Number(ID_PART[1]);
    const CURRENT_WORD = this.speechBubble.words.getDataById(ID);
    if (!CURRENT_WORD) return;
    this.speechBubble.words.remove(CURRENT_WORD);
    prevSpan.insertAdjacentElement('afterend', selectedSpan);
    selectedSpan.remove();
    prevSpan.textContent = prevWord.word;
    prevSpan.focus();
    this.adjustColor(prevSpan.getAttribute('id'));
    event.preventDefault();
    return;
  }

  /**
   * Merges the current Word with the next one,
   * both within the data structure as well as for the spans.
   * 
   * @param selectedSpan - The event target as an HTMLElement
   * @param currentText - The textContent of the selected Span
   * @param nextSpan - The following Span to merge into
   * @param event - The keyboard event triggered by user.
   * 
   * @pre There needs to be a following word
   */
  public mergeWithFollowingWord(selectedSpan: HTMLElement, currentText: string | null, nextSpan: HTMLSpanElement, event: KeyboardEvent): void {
    if (!nextSpan) return;
    const ID_PART_NEXT_SPAN = nextSpan.id.split('_');
    const ID_NEXT_SPAN = Number(ID_PART_NEXT_SPAN[1]);
    const nextWord = this.speechBubble.words.getDataById(ID_NEXT_SPAN);

    if (!nextWord) return;
    nextWord.word = currentText + nextWord.word;
    if (!selectedSpan.getAttribute('id')) return;

    const ID_PART = selectedSpan.id.split('_');
    const ID = Number(ID_PART[1]);
    const CURRENT_WORD = this.speechBubble.words.getDataById(ID);
    if (!CURRENT_WORD) return;
    this.speechBubble.words.remove(CURRENT_WORD);
    selectedSpan.remove();
    nextSpan.focus();
    this.adjustColor(nextSpan.getAttribute('id'));
    event.preventDefault();
    return;
  }

  /**
   * Checks if Element needs to adjust its color.
   * 
   * @param currentText - The Text the word started with
   * @param newText - The possibly adjusted text
   * @param spanId - The id of the span of this word
   */
  public adjustColor(spanId: string | null): void {

    if (!spanId) return;
    const ID_PART = spanId.split('_');
    const ID = Number(ID_PART[1]);

    const CHANGED_WORD = this.speechBubble.words.getDataById(ID);
    if (!CHANGED_WORD) return;
    const span = document.getElementById(spanId);
    if (!span) return;
    const COLOR_BLACK = '#000000';
    span.style.color = COLOR_BLACK;
  }

  /**
   * Updates the word the event is about in the data structure.
   * 
   * @param event - Any KeyboardEvent
   */
  //public updateWord(event: KeyboardEvent): void {
  public updateWord(): void {
    /*
    const selectedSpan = event.target as HTMLElement;
    const CURRENT_TEXT = selectedSpan.textContent;

    const ID_PART = selectedSpan.id.split('_');
    const ID = Number(ID_PART[1]);
    const word = this.speechBubble.words.getDataById(ID);
    if (!word) return;
    if (!CURRENT_TEXT) return;
    word.setWord(CURRENT_TEXT);
    selectedSpan.textContent = CURRENT_TEXT;
    */

    this.cdr.detectChanges();
  }

  /**
  * Removes empty objects from the LinkedList of words.
  */
  public removeEmptyObjects(): void {
    let current = this.speechBubble.words.head;

    while (current) {
      const next = current.next;
      if (current.data.word === "") {
        this.speechBubble.words.remove(current.data);
      }
      current = next;
    }
  }

  /**
   * Sets event listeners for the textbox to enable methods that use input data.
   * 
   * @param textbox - The HTML element representing the textbox.
   */
  private setEventListeners(textbox: HTMLElement): void {

    textbox.addEventListener('mouseover', (event: MouseEvent) => {
      this.logInfoAboutTextbox(event);
    })

    /**
     * The keydown function doesn't cover the latest change of the .textContent 
     * Attribute of a span, because typescript prioritises the keydown EventListener instead of 
     * updating the .textContent of the span first.
     * Therefore, there needs to be a keyup listener that updates
     * the data structure so the words are always correct when send 
     * to backend. (keydown > update .textContent > keyup)
     * 
     * maybe fixed by the new change to text-box?
     */
    textbox.addEventListener('keyup', (event: KeyboardEvent) => {
      //this.updateWord(event);
      this.updateWord();
    })
  }

  /**
    * Repeatedly adjusts the fontWeight of all words withing a textbox.
    */
  public adjustCurrentWordInterval(): void {

    const INTERVAL_LENGTH_MILISECONDS = 100;

    setInterval(() => {

      this.updateWordHighlight();

    }, INTERVAL_LENGTH_MILISECONDS);
  }

  /**
    * Updates the highlighting of the whole word list.
    */
  public updateWordHighlight(): void {

    let current = this.speechBubble.words.head;

    while (current) {
      const EXPECTED_SPAN = this.speechBubble.id + "_" + current.id.toString();
      const wordSpan = document.getElementById(EXPECTED_SPAN);
      if (!wordSpan) return;
      wordSpan.style.fontWeight = (current.data.fontWeight === 'bold') ? 'bold' : 'normal';

      current = current.next;
    }
  }

  getWordsArray(): Node<WordToken>[] {
    const wordsArray: Node<WordToken>[] = [];
    let current = this.speechBubble.words.head;

    while (current) {
      wordsArray.push(current);
      current = current.next;
    }

    return wordsArray;
  }

  /**
   * When the need for a new word is emitted by an existing word (emitter), creates that word and places it after the emitter.
   * 
   * @param wordAfter - String for the new word.
   * @param idOfEmitter - ID of emitting word to access its variables.
   */
  newWordAfter(wordAfter: string, idOfEmitter: number): void {
    const EMITTER = this.speechBubble.getWordTokenById(idOfEmitter);
    if (!EMITTER) return;

    const NEW_WORD_AFTER = new WordToken(wordAfter, EMITTER.confidence, EMITTER.startTime, EMITTER.endTime, EMITTER.speaker);
    this.speechBubble.words.insertAfter(NEW_WORD_AFTER, EMITTER);

    this.cdr.detectChanges();

    this.focusSpan(NEW_WORD_AFTER);
  }

  /**
   * When a word calls for a change in its data, puts that new data in place of the existing data. 
   */
  onWordUpdate(changedWord: WordToken, idOfEmitter: number): void {
    const EMITTER = this.speechBubble.words.getDataById(idOfEmitter);
    if (!EMITTER) return;
    this.speechBubble.words.replaceData(EMITTER, changedWord)

    this.cdr.detectChanges();
  }

  /**
   * Focuses on the span with the given word, if it exists.
   * 
   * @param word - Word to look for in existing spans.
   */
  focusSpan(word: WordToken): void {

    const WORD_ID = this.speechBubble.words.getNodeId(word);
    const SPAN_ID = this.speechBubble.id.toString() + "_" + WORD_ID;
    const SPAN = document.getElementById(SPAN_ID);
    if (SPAN) {
      SPAN.focus();
    }
  }








}
