import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { WordToken } from '../../data/wordToken/wordToken.model';
import { SpeechBubble } from '../../data/speechBubble/speechBubble.model';
import { Node } from '../../data/linkedList/node.model';
import { ConsoleHideService } from 'src/app/service/consoleHide.service';

/**
 * The TextBoxComponent represents a component that handles the SpeechBubble data.
 * It provides methods to generate and manipulate the content of a text box.
 * To directly access and adress every word, Spans are used instead
 * of a typical textbox with a single String.
 * The data inside the TextBox is directly connected to the data-structure of the speechBubbles.
 */
@Component({
  selector: 'app-speechbubble',
  templateUrl: './speechbubble.component.html',
  styleUrls: ['./speechbubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeechbubbleComponent implements AfterViewInit {
  @ViewChild('textbox', { static: true }) textboxRef!: ElementRef;
  @Input() speechBubble!: SpeechBubble;
  @ViewChild('textboxContainer', { static: true })
  textboxContainerRef!: ElementRef;

  constructor(
    public cdr: ChangeDetectorRef,
    public consoleHideService: ConsoleHideService,
  ) {}
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

  // Könnte so angepasst werden, dass die Wörter selbst prüfen, ob sie leer sind und dann deleteSelf emitten? Was ist in dem
  // Fall mit Standardsspeechbubble, die ein leeres Textfeld zur Eingabe braucht? Doch isFirst Attribut?
  /**
   * Removes empty objects from the LinkedList of words.
   */
  public removeEmptyObjects(): void {
    let current = this.speechBubble.words.head;

    while (current) {
      const next = current.next;
      if (current.data.word === '') {
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
    });

    textbox.addEventListener('keyup', () => {
      this.cdr.detectChanges();
    });
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
      const EXPECTED_SPAN = this.speechBubble.id + '_' + current.id.toString();
      const wordSpan = document.getElementById(EXPECTED_SPAN);
      if (!wordSpan) return;
      wordSpan.style.fontWeight = current.data.fontWeight === 'bold' ? 'bold' : 'normal';

      current = current.next;
    }
  }

  /**
   * Retrieves an array of WordToken nodes from the linked list of words in the SpeechBubble.
   * Each node in the array represents a word in the speechBubble's content.
   *
   * @returns An array of Node<WordToken> representing the words in the SpeechBubble.
   */
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
   * When a word calls for a change in its data, puts that new data in place of the existing data.
   */
  onWordUpdate(changedWord: WordToken, idOfEmitter: number): void {
    const EMITTER = this.speechBubble.words.getDataById(idOfEmitter);
    if (!EMITTER) return;
    this.speechBubble.words.replaceData(EMITTER, changedWord);

    this.cdr.detectChanges();
  }

  /**
   * Deletes emitter from speechBubble.
   *
   * @param idOfEmitter - ID of emitting word to access its variables.
   */
  onDeleteSelfCall(idOfEmitter: number): void {
    const EMITTER = this.speechBubble.getWordTokenById(idOfEmitter);
    if (!EMITTER) return;
    this.speechBubble.words.remove(EMITTER);
    this.cdr.detectChanges();
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
    const NEW_WORD_AFTER = new WordToken(
      wordAfter,
      EMITTER.confidence,
      EMITTER.startTime,
      EMITTER.endTime,
      EMITTER.speaker,
    );
    this.speechBubble.words.insertAfter(NEW_WORD_AFTER, EMITTER);
    this.cdr.detectChanges();
    this.focusSpan(NEW_WORD_AFTER);
    this.setCursorPosition(NEW_WORD_AFTER, 0);
  }

  /**
   * On call of emitting word, adds word-attribute to previous words (if existing) and calls for delete of emitter. (Merge)
   *
   * @param idOfEmitter - ID of emitting word to access its variables.
   */
  combineWords(idOfEmitter: number): void {
    let current = this.speechBubble.words.head;

    while (current) {
      if (current.id === idOfEmitter) {
        if (!current.prev || current == this.speechBubble.words.head) return;
        const PREV_WORD_LENGTH = current.prev.data.word.length;
        const COMBINED_WORDS = current.prev.data.word + current.data.word;
        current.prev.data.word = COMBINED_WORDS;
        this.focusSpan(current.prev.data);
        this.setCursorPosition(current.prev.data, PREV_WORD_LENGTH);
        return;
      }
      current = current.next;
    }
    return;
  }

  /**
   * Focuses on the span with the given word, if it exists.
   * In case of a merge before that, sets textContent and cursor position.
   *
   * @param word - Word to look for in existing spans.
   */
  focusSpan(word: WordToken): void {
    const WORD_ID = this.speechBubble.words.getNodeId(word);
    const SPAN_ID = this.speechBubble.id.toString() + '_' + WORD_ID;
    const SPAN = document.getElementById(SPAN_ID);
    if (!SPAN) return;
    SPAN.focus();

    // SPAN.textContent = word.word.trim();
  }

  /**
   * Sets the cursor position within a span element.
   *
   * @param word - Word to look for in existing spans.
   * @param position - The position to set the cursor within the span.
   */
  setCursorPosition(word: WordToken, position: number): void {
    const WORD_ID = this.speechBubble.words.getNodeId(word);
    const SPAN_ID = this.speechBubble.id.toString() + '_' + WORD_ID;
    const SPAN = document.getElementById(SPAN_ID);

    if (!SPAN) return;
    const TEXT_NODE = SPAN.firstChild;
    const range = document.createRange();

    if (!TEXT_NODE) return;
    TEXT_NODE.textContent = word.word;

    const interval = setInterval(() => {
      range.setStart(TEXT_NODE, position);
      range.collapse(true);

      const selection = window.getSelection();
      if (!selection) return;
      selection.removeAllRanges();
      selection.addRange(range);

      clearInterval(interval);
    }, 2);
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

    this.consoleHideService.speechbubbleLog('Word: ' + HOVERED_WORD + ', ID: ' + ID);
    this.consoleHideService.speechbubbleLog('Current Word: ' + CURRENT_WORD);
    this.consoleHideService.speechbubbleLog('Print Text:' + this.speechBubble.printText());
  }
}
