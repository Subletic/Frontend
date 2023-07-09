import { LinkedList } from './linkedList.model';
import { WordExport, WordToken } from './wordToken.model';

export class SpeechBubbleExport {
  
  public id: number;
  public speaker: number;
  public startTime: number;
  public endTime: number;
  public speechBubbleContent: WordExport[];

  constructor(id: number, speaker: number, begin: number, end: number, speechBubbleContent: WordExport[]) {
    this.id = id;
    this.speaker = speaker;
    this.startTime = begin;
    this.endTime = end;
    this.speechBubbleContent = speechBubbleContent;
  }

  public toJSON() {
    return {
      Id: this.id,
      Speaker: this.speaker,
      StartTime: this.startTime,
      EndTime: this.endTime,
      SpeechBubbleContent: this.speechBubbleContent.map(wordExport => wordExport.toJSON())
    };
  }

  public toSpeechBubble(){
    const words = new LinkedList();

    this.speechBubbleContent.forEach(element => {
      words.add(element.toWordToken());
    });

    return new SpeechBubble(this.speaker, this.startTime, this.endTime, words, this.id);
  }
}

export class SpeechBubble {
    public id: number;
    public speaker: number;
    public words: LinkedList;
    public begin: number;
    public end: number;

    public prev: SpeechBubble | null;
    public next: SpeechBubble | null;

    private static currentId = 0;
  
    public constructor(speaker: number, begin: number, end: number, list?: LinkedList, id?: number) {
      if(id != null) {
        this.id = id;
      } else {
        this.id = SpeechBubble.getNextId();
      }
      this.speaker = speaker;
      if(list) {
        this.words = list;
      } else {
        this.words = new LinkedList();
      }
      this.begin = begin;
      this.end = end;
      this.prev = null;
      this.next = null;
    }

    /**
     * Returns a new id.
     */
    private static getNextId(): number {
      return SpeechBubble.currentId++;
    }
  
    /**
     * Prints the word-list of this speechbubble.
     */
    public printText() {
      let current = this.words.head;
      const text = [];
      while (current) {
        text.push(current.word);
        current = current.next;
      }
      return '[' + text.join(', ') + ']';
    }

    /** 
     * Returns a String with basic information about this speechbubble.
     */
    public toString() {
      return `[${this.id}, ${this.words.size()}, ${this.begin}]`;
    }

    /** 
     * Returns a wordExportList representing the current word-list of this instance of a speechbubble.
     */
    public toList() {
      let current = this.words.head;
      const wordExportList = [];
      while (current) {
        wordExportList.push(current.getExport());
        current = current.next;
      }
      return wordExportList;
    }

    /**
     * Returns an SpeechBubblExport Object for this instance of a speechbubble.
     */
    public getExport() {
      return new SpeechBubbleExport(this.id, this.speaker, this.begin, this.end, this.toList());
    }

    /**
     * Removes empty Words from the words LinkedList
     */
    public removeEmptyWords() {
      let current = this.words.head;
      while (current) {
        if (current.word === '') {
          if(this.words.tail == current) {
            if(!current.prev) return;
            this.words.tail = current.prev;
          }
          current.remove();
        } 
        current = current.next;
      }
    }

    /** 
     * Returns the WordToken with the specified id if it exists.
     */
    public getWordTokenById(id: number): WordToken | undefined {
      let current = this.words.head;
    
      while (current) {
        if (current.id === id) {
          return current;
        }
        current = current.next;
      }
      return undefined;
    }
}