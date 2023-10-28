import { WordToken } from './wordToken.model';
//
/**
 * WordExport represents an instance of WordToken but only with the necessary info needed to
 * convert it to JSON Format. Some attributes from WordToken are irrelevant for backend, for 
 * example 'id' because it is only needed for addressing the word-content together with the spans.
 */
export class WordExport {
  public word: string;
  public confidence: number;
  public startTime: number;
  public endTime: number;
  public speaker: number;

  constructor(word: string, confidence: number, startTime: number, endTime: number, speaker: number) {
    this.word = word;
    this.confidence = confidence;
    this.startTime = startTime;
    this.endTime = endTime;
    this.speaker = speaker;
  }

  /**
   * Returns the information about the attributes of this instance
   * into the by the backend expected format. 
   * 
   */
  public toJSON() {
    return {
      Word: this.word,
      Confidence: this.confidence,
      StartTime: this.startTime,
      EndTime: this.endTime,
      Speaker: this.speaker
    };
  }

  /**
   * Returns a new WordToken similiar to this word export instance.
   */
  public toWordToken(): WordToken {
    return new WordToken(this.word, this.confidence, this.startTime, this.endTime, this.speaker);
  }
}