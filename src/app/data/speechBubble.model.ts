import { LinkedList } from './linkedList.module';

export class SpeechBubble {
    public id: number;
    public words: LinkedList;
    public begin: number;

    public prev: SpeechBubble | null;
    public next: SpeechBubble | null;
  
    constructor(id: number, begin: number) {
      this.begin = begin;
      this.id = id;
      this.words = new LinkedList();
      this.prev = null;
      this.next = null;
    }
  
    printText() {
      let current = this.words.head;
      let text = [];
      while (current) {
        text.push(current.word);
        current = current.next;
      }
      return '[' + text.join(', ') + ']';
    }
}