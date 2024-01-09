import { SpeechBubbleExport } from '../speechBubble/speechBubbleExport.model';

/**
 * The SpeechBubbleChain class represents a chain of speech bubbles.
 * It is used for exporting and importing speech bubbles in JSON format.
 */
export class SpeechBubbleChain {
  public SpeechbubbleChain: SpeechBubbleExport[];

  /**
   * Creates an instance of the SpeechBubbleChain class.
   * @param SpeechbubbleChain The array of speech bubbles in the chain.
   */
  constructor(SpeechbubbleChain: SpeechBubbleExport[]) {
    this.SpeechbubbleChain = SpeechbubbleChain;
  }

  /**
   * Converts the SpeechBubbleChain object to a JSON object.
   * @returns The JSON representation of the SpeechBubbleChain object.
   */
  toJSON() {
    return {
      SpeechbubbleChain: this.SpeechbubbleChain.map((speechBubble) => speechBubble.toJSON()),
    };
  }
}
