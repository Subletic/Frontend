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
    return JSON.stringify({
      Word: this.Word,
      Confidence: this.Confidence,
      StartTime: this.StartTime,
      EndTime: this.EndTime,
      Speaker: this.Speaker
    });
  }

}

export class WordToken {
  public word: string;
  public confidence: number;
  public startTime: number;
  public endTime: number;
  public speaker: number;
  public id: number;

  public prev: WordToken | null;
  public next: WordToken | null;

  constructor(word: string, confidence: number, startTime: number, endTime: number, speaker: number) {
    this.word = word;
    this.confidence = confidence;
    this.startTime = startTime;
    this.endTime = endTime;
    this.speaker = speaker;
    this.id = 0;
    this.prev = null;
    this.next = null;
  }

  setWord(newWord: string) {
    this.word = newWord;
  }

  getExport() {
    return new WordExport(this.word, this.confidence, this.startTime, this.endTime, this.speaker);
  }
}
