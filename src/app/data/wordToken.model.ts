export class WordExport {
  public word: string;
  public confidence: number;
  public startTime: number;
  public endTime: number;
  public speaker: number;

  constructor (word: string, confidence: number, startTime: number, endTime: number, speaker: number){
    this.word = word;
    this.confidence = confidence;
    this.startTime = startTime;
    this.endTime = endTime;
    this.speaker = speaker;
  }
  
  toJSON() {
    return {
      Word: this.word,
      Confidence: this.confidence,
      StartTime: this.startTime,
      EndTime: this.endTime,
      Speaker: this.speaker
    };
  }

  toWordToken() {
    return new WordToken(this.word, this.confidence, this.startTime, this.endTime, this.speaker);
  }
}

export class WordToken {
  public word: string;
  public confidence: number;
  public startTime: number;
  public endTime: number;
  public speaker: number;
  public id: number;

  //relevant for linkedList, objekt is in itself a node instead of having a node-class holding an wordToken object in between
  public prev: WordToken | null;
  public next: WordToken | null;

  public color: string;

  private static currentId = 0;

  constructor(word: string, confidence: number, startTime: number, endTime: number, speaker: number) {
    this.word = word;
    this.confidence = confidence;
    this.startTime = startTime;
    this.endTime = endTime;
    this.speaker = speaker;
    this.id = WordToken.getNextId();
    this.prev = null;
    this.next = null;

    this.color = '';
    this.getColor();
  }

  /**
  * Returns the color based on the confidence value.
  * @returns {string} - The color in hexadecimal format.
  */
  getColor() {
    if (this.confidence >= 0.9) {
      this.color = '#000000'; // Schwarz (Hexadezimalwert: 000000)
    } else if (this.confidence >= 0.7) {
      this.color = '#D09114'; // Gelb (Hexadezimalwert: D09114)
    } else if (this.confidence >= 0.5) {
      this.color = '#CC6600'; // Orange (Hexadezimalwert: CC6600)
    } else {
      this.color = '#BE0101'; // Rot (Hexadezimalwert: BE0101)
    }
  }

  /*ID should be irrelevant, because a new object is only instanziated by: 
  * 1. an import from backend
  * 2. an insertAfter() call in text-box.component.
  * Maybe this should be addressed in refactoring by outsourcing it to this data-directory
  * On the other hand, frontend-autonomy should be held as low as possible 
  */
  private static getNextId(): number {
    return WordToken.currentId++;
  }

  setWord(newWord: string) {
    this.word = newWord;
  }

  getExport() {
    return new WordExport(this.word, this.confidence, this.startTime, this.endTime, this.speaker);
  }

  remove() {
    if (this.prev) {
      this.prev.next = this.next;
    }
    if (this.next) {
      this.next.prev = this.prev;
    }
  }
}
