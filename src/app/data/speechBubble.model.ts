import { LinkedList } from './linkedList.module';
import { WordExport } from './wordToken.model';

export class SpeechBubbleExport {
  public Id: number;
  public Speaker: number;
  public StartTime: number;
  public EndTime: number;
  public SpeechBubbleContent: WordExport[];

  constructor(id: number, speaker: number, begin: number, end: number, speechBubbleContent: WordExport[]) {
    this.Id = id;
    this.Speaker = speaker;
    this.StartTime = begin;
    this.EndTime = end;
    this.SpeechBubbleContent = speechBubbleContent;
  }

  toJSON() {
    return JSON.stringify({
      Id: this.Id,
      Speaker: this.Speaker,
      StartTime: this.StartTime,
      EndTime: this.EndTime,
      SpeechBubbleContent: this.SpeechBubbleContent
    });
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
  
    constructor(id: number, speaker: number, begin: number, end: number) {
      this.id = id;
      this.speaker = speaker;
      this.words = new LinkedList();
      this.begin = begin;
      this.end = end;
      this.prev = null;
      this.next = null;
    }
  
    printText() {
      let current = this.words.head;
      const text = [];
      while (current) {
        text.push(current.word);
        current = current.next;
      }
      return '[' + text.join(', ') + ']';
    }

    toString() {
      return `[${this.id}, ${this.words.size()}, ${this.begin}]`;
    }

    
    getExport() {
      return new SpeechBubbleExport(this.id, this.speaker, this.begin, this.end, this.toList());
    }

    toList(){
      let current = this.words.head;
      console.log("Current:" + current);
      const wordExportList = [];
      while (current) {
        console.log("current.getExport(): " + current.getExport());
        console.log("current: " + current);
        wordExportList.push(current.getExport());
        current = current.next;
      }
      console.log("wordExportList: " + wordExportList);
      return wordExportList;
    }
}