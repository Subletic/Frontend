import { Component, OnInit, AfterViewInit, ElementRef, ViewChild  } from '@angular/core';

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
export class TextBoxComponent implements OnInit, AfterViewInit {
  receivedMessage = "";
  textbox1: TextBox;
  words = ["Hello,", "World!", "How", "are", "you?"];

  @ViewChild('textbox', { static: false }) textboxElement?: ElementRef<any> = undefined;

  constructor() {
    this.textbox1 = new TextBox(0, 0);
  }

  ngOnInit() {
    this.words.forEach((wordText) => {
      const word = new Word(wordText, 1, 0, 0);
      this.textbox1.words.add(word);
    });
  }

  ngAfterViewInit(): void {
    const textbox1 = this.textbox1;
    const textboxElement = this.textboxElement?.nativeElement;

    if (textboxElement) {
      textboxElement.innerHTML = textbox1.words.print();

      textboxElement.addEventListener('mouseover', (event: MouseEvent) => {
        const hoveredWord = (event.target as HTMLElement)?.textContent;
        const wordID = (event.target as HTMLElement)?.getAttribute('id');
        const currentWord = this.findWordById(Number(wordID));

        if (hoveredWord && wordID && currentWord) {
          console.log('Word: ' + hoveredWord + ', ID: ' + wordID);
          console.log('Confidence:', currentWord.confidence);
        }
      });

      // ... Weitere Event-Listener hinzufügen ...

      textboxElement.addEventListener('keydown', (event: KeyboardEvent) => {
        const key = event.key;
        const wordID = (event.target as HTMLElement)?.getAttribute('id');
        const currentWord = this.findWordById(Number(wordID));

        if (key === 'Backspace' && currentWord?.prev) {
          const prevWord = currentWord.prev;
          textbox1.words.remove(currentWord);
          textboxElement.innerHTML = textbox1.words.print();
          console.log('Deleted Word:', currentWord.text);
          console.log('Print Text:', textbox1.printText());
        }
      });

      // ... Weitere Event-Listener hinzufügen ...
    }
  }

   findWordById(id: number): Word | null {
    let current = this.textbox1.words.head;
    while (current) {
      if (current.id === id) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  }
