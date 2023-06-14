import { WordToken } from './wordToken.model';
import { WordExport } from './wordToken.model';

//Für die Zukunft: LinkedList mergen zu einer, dieses mal "LinkedList<T>", Problem: Attribute von T?

export class LinkedList {
    public head: WordToken | null;
    public tail: WordToken | null;
    public currentIndex: number;
  
    constructor() {
      this.head = null;
      this.tail = null;
      this.currentIndex = 0;
    }

    toJSON(): string {
      const wordExports: WordExport[] = [];
      let current = this.head;
    
      while (current) {
        wordExports.push(current.getExport());
        current = current.next;
      }
    
      return JSON.stringify(wordExports);
    }
    
  
    add(word: WordToken) {
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
  
    remove(word: WordToken) {
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
  
    printWordList() {
      let current = this.head;
      const words = [];
      while (current) {
        words.push(current.word);
        current = current.next;
      }
      return words.join(" ");
    }

    size() {
      let current = this.head;
      let count = 0;
      while (current) {
        count++;
        current = current.next;
      }
      return count;
    }

    toString() {
      let current = this.head;
      const elements = [];
      while (current) {
        elements.push(current.word);
        current = current.next;
      }
      return elements.join(" ");
    }
  }