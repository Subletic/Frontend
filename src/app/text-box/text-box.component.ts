import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { WordToken } from '../data/wordToken.model';
import { SpeechBubble } from '../data/speechBubble.model';

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
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent implements AfterViewInit {

  @ViewChild('textbox', { static: true }) textboxRef!: ElementRef;
  @Input() textbox!: SpeechBubble;

  /**
   * After Init of View, generates the Words from the data structure
   * inside the textbox. Adds event listeners to the textbox and generates
   * an empty words in case that the list of words is empty.
   */
  ngAfterViewInit() {
    const textbox = this.textboxRef.nativeElement;

    if(this.textbox.words.head == null) {
      this.textbox.words.add( new WordToken('', 1, 1, 1, 1));
    }

    textbox.innerHTML = this.generateHTML();

    textbox.addEventListener('mouseover', (event: MouseEvent) => {
      this.logInfoAboutTextbox(event);
    })
    
    textbox.addEventListener('keydown', (event: KeyboardEvent) => {
      console.log(event);
      this.handleKeyboardEventTextbox(event);
    })

    /**
     * The keydown function doesn't cover the latest change of the .textContent 
     * Attribute of a span, because typescript prioritises the keydown EventListener instead of 
     * updating the .textContent of the span first.
     * Therefore, there needs to be a keyup listener that updates
     * the data structure so the words are always correct when send 
     * to backend. (keydown > update .textContent > keyup)
     */
    textbox.addEventListener('keyup', (event: KeyboardEvent) => {
      this.updateWord(event);
    })
  }

  /**
  * Generates the HTML representation of the textbox content.
  * Each word in the textbox is wrapped in a <span> element with a unique ID and the contenteditable attribute.
  * The generated HTML string contains all the word elements separated by a space.
  * @returns The HTML string representing the textbox content.
  */
  public generateHTML(): string {
    const wordElements: string[] = []
    let current = this.textbox.words.head;
    while (current) {
      const wordWithId = `<span id="${current.id}" style="color: ${current.color}" contenteditable="true">${current.word}</span>`;
      wordElements.push(wordWithId);
      current = current.next;
    }
    return wordElements.join(' ');
  }

  /**
   * Prints info about a certain textbox when its hovered over.
   * 
   * @param event - Any MouseEvent on the Textbox
   */
  public logInfoAboutTextbox(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!(target.tagName === 'SPAN')) return;
      const hoveredWord = target.textContent;
      const wordID = target.id;
      const currentWord = this.findWordById(Number(wordID));

      console.log('Word: ' + hoveredWord + ', ID: ' + wordID);
      console.log('Current Word: ', currentWord);
      console.log('Print Text:', this.textbox.printText());
  }

  /**
   * Handles KeyboardEvent on Textbox. 
   * Covers 2 cases: Space is pressend and Backspace is pressed at position 0.
   * Calls either handleBackSpacePressAtStart() or handleSpacePress() as follower functions.
   * 
   * @param event - Any KeyboardEvent on the textbox
   * 
   * @pre should be added as event listener to a textbox Element 
   * 
   */
  public handleKeyboardEventTextbox(event: KeyboardEvent) {
    const selectedSpan = event.target as HTMLElement;
    const currentText = selectedSpan.textContent;
    const cursorPosition = window.getSelection()?.getRangeAt(0)?.startOffset;
    const spanId = selectedSpan.id;
    const isInFullSelection = window.getSelection()?.toString().length === currentText?.length;

    if (cursorPosition === 0 && event.key === 'Backspace') {
      this.handleBackspacePressAtStart(selectedSpan, currentText, isInFullSelection, spanId, event)
    }

    if (event.code === 'Space') {
      this.handleSpacePress(selectedSpan, currentText, cursorPosition, spanId, event);
    }

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
  public handleBackspacePressAtStart(selectedSpan: HTMLElement, currentText: string | null, isInFullSelection: boolean, spanId: string, event: KeyboardEvent) {
    const prevSpan = selectedSpan.previousElementSibling as HTMLSpanElement;
    if (isInFullSelection) {
      this.isInFullSelectionDeletion(selectedSpan, spanId, event);
      return;
    }

    if (!prevSpan.getAttribute('id') != null) {
      this.mergeWithPreviousWord(selectedSpan, currentText, prevSpan, event);
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
  public isInFullSelectionDeletion(selectedSpan: HTMLElement, spanId: string, event: KeyboardEvent) {
    const currentWord = this.findWordById(Number(spanId));
    if(!currentWord) return;
    currentWord.word = '';
    this.textbox.words.remove(currentWord);
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
  public mergeWithPreviousWord(selectedSpan: HTMLElement, currentText: string | null, prevSpan: HTMLSpanElement, event: KeyboardEvent) {
    const prevWord = this.findWordById(Number(prevSpan.getAttribute('id')));
    if (!prevWord) return;
    prevWord.word += currentText;
    if (!prevSpan.getAttribute('id')) return;
    const currentWord = this.findWordById(Number(selectedSpan.getAttribute('id')));
    if (!currentWord) return;
    this.textbox.words.remove(currentWord);
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
  public mergeWithFollowingWord(selectedSpan: HTMLElement, currentText: string | null, nextSpan: HTMLSpanElement, event: KeyboardEvent) {
    if (!nextSpan) return;
    if(!nextSpan.getAttribute('id')) return;
    const nextWord = this.findWordById(Number(nextSpan.getAttribute('id')));

    if (!nextWord) return;
    nextWord.word = currentText + nextWord.word;
    if(!selectedSpan.getAttribute('id')) return;
    const currentWord = this.findWordById(Number(selectedSpan.getAttribute('id')));
    if (!currentWord) return;
    this.textbox.words.remove(currentWord);
    selectedSpan.remove();
    nextSpan.focus();
    this.adjustColor(nextSpan.getAttribute('id'));
    event.preventDefault();
    return; 
  }

  /**
    * This function handles the case when the Space key is pressed without the Shift key in the middle of a word.
    * Splits the current word into two words at the cursor position
    * If the text before the cursor is not empty, a new
    * empty word is inserted after the current word in the LinkedList.
    * The new word and the new empty word are displayed in separate
    * contenteditable spans, and the focus is set to the new span.
    * 
    * @param selectedSpan - The event target as an HTMLElement
    * @param currentText - The textContent of the selected Span
    * @param cursorPosition - The cursor position at the time of the call
    * @param spanId - Id of the selectedSpan
    * @param event - The keyboard event triggered by user.
    */
  public handleSpacePress(selectedSpan: HTMLElement, currentText: string | null, cursorPosition: number | undefined, spanId: string, event: KeyboardEvent) {
    if(!(currentText && typeof cursorPosition === 'number')) return;
    const wordBeforeCursor = currentText.substring(0, cursorPosition);
    const wordAfterCursor = currentText.substring(cursorPosition);
    selectedSpan.textContent = wordBeforeCursor;
    this.adjustColor(selectedSpan.getAttribute('id'));

    if (wordBeforeCursor.trim() !== '') {
      const currentWord = this.findWordById(Number(spanId));
      if (!currentWord) return;
      const newWord = new WordToken(wordAfterCursor, 1 ,currentWord.startTime, currentWord.endTime, currentWord.speaker);
      currentWord.updateWordColor();

      currentWord.confidence = 1;
      this.insertAfter(newWord, currentWord);
      currentWord.word = wordBeforeCursor;

      const newSpan = document.createElement('span');
      newSpan.id = newWord.id.toString();
      newSpan.contentEditable = 'true';
      newSpan.textContent = wordAfterCursor;

      selectedSpan.insertAdjacentElement('afterend', newSpan);
      selectedSpan.insertAdjacentText('afterend', ' ');

      newSpan.focus();
      // Event handling for the new span
      /*
      newSpan.addEventListener('input', () => {
        const newText = newSpan.textContent;
        const word = this.findWordById(Number(newSpan.id));
        if (!word || !newText) return;
        word.setWord(newText);
        
      });
      */
      
    } else if (wordBeforeCursor.trim() == '') {
      const currentWord = this.findWordById(Number(spanId));
      if (!currentWord) return;
      currentWord.setWord(wordAfterCursor);
      selectedSpan.textContent = wordAfterCursor;
      selectedSpan.insertAdjacentText('beforebegin', ' ');
      selectedSpan.focus();
      
    }

    event.preventDefault();
  }

  /**
   * Checks if Element needs to adjust its color.
   * 
   * @param currentText - The Text the word started with
   * @param newText - The possibly adjusted text
   * @param spanId - The id of the span of this word
   */
  public adjustColor(spanId: string | null) {
    const changedWord = this.findWordById(Number(spanId));
    if(!changedWord) return;
    if(!spanId) return;
    const span =  document.getElementById(spanId);
    if(!span) return;
    span.style.color = '#000000';
  }

  /**
   * Updates the word the event is about in the data structure.
   * 
   * @param event - Any KeyboardEvent
   */
  public updateWord(event: KeyboardEvent) {
    const selectedSpan = event.target as HTMLElement;
    const currentText = selectedSpan.textContent;
    const word = this.findWordById(Number(selectedSpan.id));
    if(!word) return;
    if(!currentText) return;
    word.setWord(currentText);
    selectedSpan.textContent = currentText;
  }

  /**
   * Inserts a new word after a specified word in the linked list.
   * @param {Word} newWord - The new word to insert.
   * @param {Word} prevWord - The word after which the new word should be inserted.
   */
  public insertAfter(newWord: WordToken, prevWord: WordToken): void {
    newWord.id = this.textbox.words.currentIndex;
    this.textbox.words.currentIndex++;

    newWord.prev = prevWord;
    newWord.next = prevWord.next;

    if (prevWord.next) {
      prevWord.next.prev = newWord;
    }
    prevWord.next = newWord;
    if (prevWord === this.textbox.words.tail) {
      this.textbox.words.tail = newWord;
    }
  }

  /**
   * Finds a word in the text box by its ID.
   * @param {string} id - The ID of the word to find.
   * @returns {Word|null} - The found word or null if not found.
   */
  public findWordById(id: number): WordToken | null {
    let current = this.textbox.words.head;
    while (current) {
      if (current.id === id) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  /**
  * Removes empty objects from the LinkedList of words.
  */
  public removeEmptyObjects(): void {
    let current = this.textbox.words.head;

    while (current) {
      const next = current.next;
      if (current.word === "") {
        this.textbox.words.remove(current);
      }
      current = next;
    }
  }

}
