export class WordExport {
  public Word: string;
  public Confidence: number;
  public StartTime: number;
  public EndTime: number;
  public Speaker: number;

  constructor (word: string, confidence: number, startTime: number, endTime: number, speaker: number){
    this.Word = word;
    this.Confidence = confidence;
    this.StartTime = startTime;
    this.EndTime = endTime;
    this.Speaker = speaker;
  }
  
  toJSON() {
    return {
      Word: this.Word,
      Confidence: this.Confidence,
      StartTime: this.StartTime,
      EndTime: this.EndTime,
      Speaker: this.Speaker
    };
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

  private static currentId: number = 0;

  constructor(word: string, confidence: number, startTime: number, endTime: number, speaker: number) {
    this.word = word;
    this.confidence = confidence;
    this.startTime = startTime;
    this.endTime = endTime;
    this.speaker = speaker;
    this.id = WordToken.getNextId();
    this.prev = null;
    this.next = null;
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
}
