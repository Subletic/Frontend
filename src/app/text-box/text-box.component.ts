import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

class Word {
  public text: string;
  public confidence: number;
  public begin: number;
  public end: number;
  public id: number;

  public prev: Word | null;
  public next: Word | null;

  constructor(text: string, confidence: number, begin: number, end: number) {
    this.text = text;
    this.confidence = confidence;
    this.begin = begin;
    this.end = end;
    this.id = 0;
    this.prev = null;
    this.next = null;
  }

  setText(newText: string) {
    this.text = newText;
  }
}

class TextBox {
  public id: number;
  public words: LinkedList;
  public begin: number;

  constructor(id: number, begin: number) {
    this.begin = begin;
    this.id = id;
    this.words = new LinkedList();
  }

  printText() {
    let current = this.words.head;
    let text = [];
    while (current) {
      text.push(current.text);
      current = current.next;
    }
    return '[' + text.join(', ') + ']';
  }
}

class LinkedList {
  public head: Word | null;
  public tail: Word | null;
  public currentIndex: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.currentIndex = 0;
  }

  add(word: Word) {
    word.id = this.currentIndex;
    this.currentIndex++;

    if (!this.head) {
      this.head = word;
      this.tail = word;
    } else {
      if (this.tail) {
        this.tail.next = word;
        word.prev = this.tail;
        this.tail = word;
      }
    }
  }

  remove(word: Word) {
    if (word === this.head) {
      this.head = word.next;
    }
    if (word === this.tail) {
      this.tail = word.prev;
    }
    if (word.prev) {
      word.prev.next = word.next;
    }
    if (word.next) {
      word.next.prev = word.prev;
    }
  }

  print() {
    let current = this.head;
    let words = [];
    while (current) {
      words.push(current.text);
      current = current.next;
    }
    return words.join(" ");
  }
}

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.css']
})
export class TextBoxComponent implements OnInit {
  
  @ViewChild('textbox', { static: true }) textboxRef!: ElementRef;

  textbox: TextBox = new TextBox(0, 0);

  ngOnInit() {
    //Umbenannt von $textbox
    const textbox = this.textboxRef.nativeElement;
    const textboxId = textbox.getAttribute('data-id');

    const words = ['Hello,', 'World!', 'How', 'are', 'you?'];

    words.forEach((wordText) => {
      const word = new Word(wordText, 1, 1, 1);
      this.textbox.words.add(word);
    });

    textbox.innerHTML = this.generateHTML();
    console.log('Print Text:', this.textbox.printText());


     //Zeile 146 ".}).on("mouseover", "span", function() {"
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

      //Zeile 157 $textbox.on("keydown", "span", function(event) {
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
              // Delete the current word when fully selected + Backspacing
              const currentWord = this.findWordById(Number(spanId));
              //! 'currentWord' is possibly 'null'. ! POSSIBLE ERROR LOCATION 1
              if(currentWord) {
                console.log("Possible Error Location 1.");
                currentWord.text = '';
                this.textbox.words.remove(currentWord);
              }
              selectedSpan.remove();
        
              event.preventDefault();
              return;
            }

            if (prevSpan) {
              const prevWord = this.findWordById(Number(prevSpan.getAttribute('id')!));
              if (prevWord) {
                prevWord.text += currentText;
                const currentWord = this.findWordById(Number(selectedSpan.getAttribute('id')!));
                if (currentWord) {
                  this.textbox.words.remove(currentWord); // Remove the current word from the linked list
                }
                prevSpan.insertAdjacentElement('afterend', selectedSpan);
                selectedSpan.remove();
                prevSpan.textContent = prevWord.text; // Update the text of the previous span
                prevSpan.focus();
                event.preventDefault();
                return;
              }
            } else {
              const nextSpan = selectedSpan.nextElementSibling as HTMLSpanElement;
            }

            const nextSpan = selectedSpan.nextElementSibling as HTMLSpanElement;

            if (nextSpan) {
              const nextWord = this.findWordById(Number(nextSpan.getAttribute('id')!));
              if (nextWord) {
                nextWord.text = currentText + nextWord.text;
                const currentWord = this.findWordById(Number(selectedSpan.getAttribute('id')!));
                if (currentWord) {
                  this.textbox.words.remove(currentWord); // Remove the current word from the linked list
                }
                selectedSpan.remove();
                nextSpan.focus();
                event.preventDefault();
                return;
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
        if (event.code === 'Space') { // Space key is pressed in the middle

          //! 'currentText' is possibly 'null'. ! POSSIBLE ERROR LOCATION 2
          if(currentText && typeof cursorPosition === 'number') {
            console.log("Possible error location 2.");
            const wordBeforeCursor = currentText.substring(0, cursorPosition);
            const wordAfterCursor = currentText.substring(cursorPosition);
            selectedSpan.textContent = wordBeforeCursor;
          
            //! Ab hier großen Teil auf einmal übersetzt, mögliche Fehlerquelle !

            if (wordBeforeCursor !== '') {
              const newWord = new Word(wordAfterCursor, 1, 1, 1);
              const currentWord = this.findWordById(Number(spanId));
              if (currentWord) {
                this.insertAfter(newWord, currentWord);
                currentWord.text = wordBeforeCursor;
                const newSpan = document.createElement('span');
                newSpan.id = newWord.id.toString();
                newSpan.contentEditable = 'true';
                newSpan.textContent = wordAfterCursor;
                selectedSpan.insertAdjacentText('afterend', ' ');
                selectedSpan.insertAdjacentElement('afterend', newSpan);
                newSpan.focus();
            
                // Event handling for the new span
                newSpan.addEventListener('input', () => {
                  const newText = newSpan.textContent;
                  const word = this.findWordById(Number(newSpan.id));
                  if (word) {
                    if (newText !== null) {
                      word.setText(newText);
                    }
                  }
                });
              }
            } else {
              const currentWord = this.findWordById(Number(spanId));
              if (currentWord) {
                currentWord.setText(wordAfterCursor);
                selectedSpan.textContent = wordAfterCursor;
                selectedSpan.insertAdjacentText('beforebegin', ' ');
                selectedSpan.focus();
              }
            }
            
            event.preventDefault();
          }
        }

        //Unsicher, wo genau folgender Code hin muss nach der Übersetzung von JS..

        const selectedSpan2 = this.textboxRef.nativeElement.querySelector('span:focus');
        if (selectedSpan2) {
          const currentText = selectedSpan2.textContent;
          if(currentText) {
            selectedSpan2.textContent = currentText.trim();
          }
        }
      })
    })
  }

  /**
   * Finds a word in the text box by its ID.
   * @param {string} id - The ID of the word to find.
   * @returns {Word|null} - The found word or null if not found.
   */
  generateHTML(): string {
    const wordElements: string[] = []
    let current = this.textbox.words.head;
    while (current) {
      const wordWithId = `<span id="${current.id}" contenteditable="true">${current.text}</span>`;
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
  insertAfter(newWord: Word, prevWord: Word): void {

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
  findWordById(id: number): Word | null {
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
      if (current.text === "") {
        this.textbox.words.remove(current);
      }
      current = next;
    }
  }
  
}