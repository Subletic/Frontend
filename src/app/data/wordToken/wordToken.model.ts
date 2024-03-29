import { WordExport } from './wordExport.model';

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

  public color: string;
  public fontWeight: string;

  constructor(
    word: string,
    confidence: number,
    startTime: number,
    endTime: number,
    speaker: number,
  ) {
    this.word = word;
    this.confidence = confidence;
    this.startTime = startTime;
    this.endTime = endTime;
    this.speaker = speaker;

    this.color = '';
    this.fontWeight = 'normal';
    this.setColor();
  }

  /**
   * Sets the color based on the confidence value.
   */
  public setColor(): void {
    const HIGH_CONFIDENCE = 0.9;
    const MID_CONFIDENCE = 0.7;
    const LOW_CONFIDENCE = 0.5;

    const COLOR_BLACK = '#000000';
    const COLOR_YELLOW = '#D09114';
    const COLOR_ORANGE = '#CC6600';
    const COLOR_RED = '#BE0101';

    if (this.confidence >= HIGH_CONFIDENCE) {
      this.color = COLOR_BLACK;
    } else if (this.confidence >= MID_CONFIDENCE) {
      this.color = COLOR_YELLOW;
    } else if (this.confidence >= LOW_CONFIDENCE) {
      this.color = COLOR_ORANGE;
    } else {
      this.color = COLOR_RED;
    }
  }

  /**
   * Sets the text of the current object to a new value.
   *
   * @param newWord - the new text to set to
   */
  public setWord(newWord: string): void {
    this.word = newWord;
  }

  /**
   * Returns an WordExport Objekt similiar to this Instance of WordToken
   */
  public getExport(): WordExport {
    return new WordExport(this.word, this.confidence, this.startTime, this.endTime, this.speaker);
  }

  /**
   * Updates the colors of the word.
   *
   * @pre Should only be called if the confidence actually changed.
   */
  public updateWordColor(): void {
    const HIGHEST_CONFIDENCE = 1;
    const COLOR_BLACK = '#000000';

    this.confidence = HIGHEST_CONFIDENCE;
    this.color = COLOR_BLACK;
    return;
  }

  /**
   * Adjusts FontWeight based on a given time.
   *
   * @param audioTime - Time stamp to compare own time slot with.
   */
  public adjustFontWeight(audioTime: number) {
    this.fontWeight = this.currentAudioTimeOnWord(audioTime) ? 'bold' : 'normal';
  }

  /**
   * Compares given audioTime to time stamp of this word.
   *
   * @param audioTime - Time stamp to compare own time slot with.
   */
  private currentAudioTimeOnWord(audioTime: number): boolean {
    return this.startTime <= audioTime && this.endTime >= audioTime;
  }
}
