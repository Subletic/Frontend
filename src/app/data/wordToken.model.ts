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

  constructor (word: string, confidence: number, startTime: number, endTime: number, speaker: number){
    this.word = word;
    this.confidence = confidence;
    this.startTime = startTime;
    this.endTime = endTime;
    this.speaker = speaker;
  }
  
  /**
   * Returns the information about the attributes of this instance
   * into the from the backend expected format. 
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

/**
 * WordToken represents a single word from a textbox. It acts as a node within one of the two linkedList
 * classes. 
 */
export class WordToken {
  public word: string;
  public confidence: number;
  public startTime: number;
  public endTime: number;
  public speaker: number;
  public id: number;

  public color: string;

  private static currentId = 0;

  constructor(word: string, confidence: number, startTime: number, endTime: number, speaker: number) {
    this.word = word;
    this.confidence = confidence;
    this.startTime = startTime;
    this.endTime = endTime;
    this.speaker = speaker;
    this.id = WordToken.getNextId();

    this.color = '';
    this.getColor();
  }

  /**
  * Returns the color based on the confidence value.
  * @returns {string} - The color in hexadecimal format.
  */
  public getColor() {
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

  /**
   * Sets the text of the current object to a new value.
   * 
   * @param newWord - the new text to set to
   */
  public setWord(newWord: string) {
    this.word = newWord;
  }

  /**
   * Returns an WordExport Objekt similiar to this Instance of WordToken
   */
  public getExport() {
    return new WordExport(this.word, this.confidence, this.startTime, this.endTime, this.speaker);
  }

  /**
  * Updates the colors of the word.
  * 
  * @pre Should only be called if the confidence actually changed.
  */
  public updateWordColor() {

    this.confidence = 1;
    this.color = '#000000';
    return;
  }
}
