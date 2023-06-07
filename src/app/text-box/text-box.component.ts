import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { WordToken } from '../data/wordToken.model';
import { SpeechBubble } from '../data/speechBubble.model';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent implements OnInit {
  
  @ViewChild('textbox', { static: true }) textboxRef!: ElementRef;

  @Input() textbox!: SpeechBubble;

  ngOnInit() {
    const textbox = this.textboxRef.nativeElement;

    const words = ['Hello,', 'World!', 'How', 'are', 'you?'];

    words.forEach((wordText) => {
      const word = new WordToken(wordText, 1, 1, 1, 1);
      this.textbox.words.add(word);
    });

    textbox.innerHTML = this.generateHTML();
    console.log('Print Text:', this.textbox.printText());

    textbox.addEventListener('mouseover', (event: MouseEvent) => {
    
      const target = event.target as HTMLElement;
      if (target.tagName === 'SPAN') {
        const hoveredWord = target.textContent;
        const wordID = target.id;
        const currentWord = this.findWordById(Number(wordID));

        console.log('Word: ' + hoveredWord + ', ID: ' + wordID);
        console.log('Current Word: ', currentWord);
        console.log('Print Text:', this.textbox.printText());
      }

    })

    textbox.addEventListener('keydown', (event: KeyboardEvent) => {

      const selectedSpan = event.target as HTMLElement;
      const currentText = selectedSpan.textContent;
      const cursorPosition = window.getSelection()?.getRangeAt(0)?.startOffset;
      const spanId = selectedSpan.id;
    
      const isFullSelection = window.getSelection()?.toString().length === currentText?.length;

      /**
      * This if statement handles the case when the Backspace key is pressed
      * at the beginning of a word.
      * Previous Word exists -> Merges with previous Word
      * PrevWord doesn't exist -> Merges with next Word
      */
      if (cursorPosition === 0) {
        if (event.key === 'Backspace') { // Backspace key is pressed at the beginning
          const prevSpan = selectedSpan.previousElementSibling as HTMLSpanElement;

          if (isFullSelection) {
            const currentWord = this.findWordById(Number(spanId));
            if(currentWord) {
              currentWord.word = '';
              this.textbox.words.remove(currentWord);
            }
            selectedSpan.remove();
      
            event.preventDefault();
            return;
          }

          if (prevSpan.getAttribute('id') != null) {
            const prevWord = this.findWordById(Number(prevSpan.getAttribute('id')));
            if (prevWord) {
              prevWord.word += currentText;
              if (prevSpan.getAttribute('id') != null) {
                const currentWord = this.findWordById(Number(selectedSpan.getAttribute('id')));
                if (currentWord) {
                  this.textbox.words.remove(currentWord); // Remove the current word from the linked list
                }
              }
              prevSpan.insertAdjacentElement('afterend', selectedSpan);
              selectedSpan.remove();
              prevSpan.textContent = prevWord.word; // Update the text of the previous span
              prevSpan.focus();
              event.preventDefault();
              return;
            }
          } 

          const nextSpan = selectedSpan.nextElementSibling as HTMLSpanElement;

          if (nextSpan) {
            if(nextSpan.getAttribute('id')){
              const nextWord = this.findWordById(Number(nextSpan.getAttribute('id')));
            
              if (nextWord) {
                nextWord.word = currentText + nextWord.word;
                if(selectedSpan.getAttribute('id')){
                  const currentWord = this.findWordById(Number(selectedSpan.getAttribute('id')));
                  if (currentWord) {
                    this.textbox.words.remove(currentWord);
                  }
                }
                selectedSpan.remove();
                nextSpan.focus();
                event.preventDefault();
                return;
              }
            }
          }
        }
      }

      /**
      * This if statement handles the case when the Space key is pressed without the Shift key in the middle of a word.
      * Splits the current word into two words at the cursor position
      * If the text before the cursor is not empty, a new 
      * empty word is inserted after the current word in the LinkedList.
      * The new word and the new empty word are displayed in separate 
      * contenteditable spans, and the focus is set to the new span.
      */
      if (event.code === 'Space') {

        if(currentText && typeof cursorPosition === 'number') {
          const wordBeforeCursor = currentText.substring(0, cursorPosition);
          const wordAfterCursor = currentText.substring(cursorPosition);
          selectedSpan.textContent = wordBeforeCursor;

          console.log(wordBeforeCursor);
          console.log(wordAfterCursor);
        
          //! Ab hier großen Teil auf einmal übersetzt, mögliche Fehlerquelle !

          if (wordBeforeCursor.trim() !== '') {
            const newWord = new WordToken(wordAfterCursor, 1, 1, 1, 1);
            const currentWord = this.findWordById(Number(spanId));
            if (currentWord) {
              this.insertAfter(newWord, currentWord);
              currentWord.word = wordBeforeCursor;
              const newSpan = document.createElement('span');
              newSpan.id = newWord.id.toString();
              newSpan.contentEditable = 'true';
              newSpan.textContent = wordAfterCursor;
              selectedSpan.insertAdjacentElement('afterend', newSpan);
              selectedSpan.insertAdjacentText('afterend', ' '); // Leerzeichen wird hier eingefügt
              newSpan.focus();
          
              // Event handling for the new span
              newSpan.addEventListener('input', () => {
                const newText = newSpan.textContent;
                const word = this.findWordById(Number(newSpan.id));
                if (word) {
                  if (newText !== null) {
                    word.setWord(newText);
                  }
                }
              });
            }
          } else if (wordBeforeCursor.trim() == '') {
            const currentWord = this.findWordById(Number(spanId));
            if (currentWord) {
              currentWord.setWord(wordAfterCursor);
              selectedSpan.textContent = wordAfterCursor;
              selectedSpan.insertAdjacentText('beforebegin', ' ');
              selectedSpan.focus();
            }
          }

          event.preventDefault();
        }
      }

      const selectedSpan2 = this.textboxRef.nativeElement.querySelector('span:focus');
      if (selectedSpan2) {
        const currentText = selectedSpan2.textContent;
        if(currentText) {
          selectedSpan2.textContent = currentText.trim();
        }
      }
    })
  }
  
  /**
  * Generates the HTML representation of the textbox content.
  * Each word in the textbox is wrapped in a <span> element with a unique ID and the contenteditable attribute.
  * The generated HTML string contains all the word elements separated by a space.
  @returns The HTML string representing the textbox content.
  */
  generateHTML(): string {
    const wordElements: string[] = []
    let current = this.textbox.words.head;
    while (current) {
      const wordWithId = `<span id="${current.id}" contenteditable="true">${current.word}</span>`;
      wordElements.push(wordWithId);
      current = current.next;
    }

    return wordElements.join(' ');
  }

  /**
   * Inserts a new word after a specified word in the linked list.
   * @param {Word} newWord - The new word to insert.
   * @param {Word} prevWord - The word after which the new word should be inserted.
   */
  insertAfter(newWord: WordToken, prevWord: WordToken): void {
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
  findWordById(id: number): WordToken | null {
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
  removeEmptyObjects(): void {
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