import { Component, OnInit } from '@angular/core';
import { SpeechBubble } from '../data/speechBubble.model';

export class LinkedList {
    public head: SpeechBubble | null;
    public tail: SpeechBubble | null;
    public currentIndex: number;
  
    constructor() {
      this.head = null;
      this.tail = null;
      this.currentIndex = 0;
    }
  
    add(speechBubble: SpeechBubble) {
        speechBubble.id = this.currentIndex;
      this.currentIndex++;
  
      if (!this.head) {
        this.head = speechBubble;
        this.tail = speechBubble;
      } else {
        if (this.tail) {
          this.tail.next = speechBubble;
          speechBubble.prev = this.tail;
          this.tail = speechBubble;
        }
      }
    }
  
    remove(speechBubble: SpeechBubble) {
      if (speechBubble === this.head) {
        this.head = speechBubble.next;
      }
      if (speechBubble === this.tail) {
        this.tail = speechBubble.prev;
      }
      if (speechBubble.prev) {
        speechBubble.prev.next = speechBubble.next;
      }
      if (speechBubble.next) {
        speechBubble.next.prev = speechBubble.prev;
      }
    }
  
    print() {
        let current = this.head;
        const speechBubbles = [];
        while (current) {
            speechBubbles.push(current.words);
            current = current.next;
        }
        return speechBubbles.join(" ");
    }

    toString() {
      let current = this.head;
      const speechBubbles = [];
      while (current) {
        speechBubbles.push(current.toString());
        current = current.next;
      }
      return speechBubbles.join(" ");
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
}

@Component({
  selector: 'app-text-sheet',
  templateUrl: './textSheet.component.html',
  styleUrls: ['./textSheet.component.scss']
})
export class TextSheetComponent implements OnInit {

    speechBubbles: LinkedList = new LinkedList;

    ngOnInit() {
        
        const testBubble1 = new SpeechBubble(0, 0);
        
        this.speechBubbles.add(testBubble1);
    }

    getSpeechBubblesArray(): SpeechBubble[] {
        let current = this.speechBubbles.head;
        const speechBubbles: SpeechBubble[] = [];
        while (current) {
          speechBubbles.push(current);
          current = current.next;
        }
        return speechBubbles;
      }

    addNewStandardSpeechBubble() {
        const testBubble1 = new SpeechBubble(0, 0);
        
        this.speechBubbles.add(testBubble1);

        console.log(this.speechBubbles.toString());
    }
    
    deleteOldestSpeechBubble() {

        if(this.speechBubbles.head){
            this.speechBubbles.remove(this.speechBubbles.head);
        }
    }

}
