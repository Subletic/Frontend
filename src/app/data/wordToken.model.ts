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
}
