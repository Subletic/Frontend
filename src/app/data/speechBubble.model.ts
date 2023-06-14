import { LinkedList } from './linkedList.model';
import { WordExport } from './wordToken.model';

export class SpeechBubbleExport {
  
  public Id: number;
  
  public Speaker: number;
  public StartTime: number;
  public EndTime: number;
  public SpeechBubbleContent: WordExport[];

  public CreationTime: String;

  constructor(speaker: number, begin: number, end: number, speechBubbleContent: WordExport[], id: number) {
    this.Id = id;
    this.Speaker = speaker;
    this.StartTime = begin;
    this.EndTime = end;
    this.SpeechBubbleContent = speechBubbleContent;

    this.CreationTime = "2023-06-12T12:34:56.789Z";
  }

  toJSON() {
    return {
      Id: this.Id,
      Speaker: this.Speaker,
      StartTime: this.StartTime,
      EndTime: this.EndTime,
      CreationTime: this.CreationTime,
      SpeechBubbleContent: this.SpeechBubbleContent.map(wordExport => wordExport.toJSON())
    };
  }

  toSpeechBubble(){
    let words = new LinkedList();

    this.SpeechBubbleContent.forEach(element => {
      words.add(element.toWordToken());
    });

    return new SpeechBubble(this.Speaker, this.StartTime, this.EndTime, words, this.Id);
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
  
    public constructor(speaker: number, begin: number, end: number, list?: any, id?: number) {
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

    private static getNextId(): number {
      return SpeechBubble.currentId++;
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

    toList(){
      let current = this.words.head;
      const wordExportList = [];
      while (current) {
        wordExportList.push(current.getExport());
        current = current.next;
      }
      return wordExportList;
    }

    getExport() {
      return new SpeechBubbleExport(this.speaker, this.begin, this.end, this.toList(), this.id);
    }
}