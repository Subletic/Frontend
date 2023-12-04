import { transcription_config } from './transcription_config.module';

/**
 * Class representing a dictionary containing transcription configuration.
 */
export class dictionary {
  transcription_config: transcription_config;

  constructor(transcription_config: transcription_config) {
    this.transcription_config = transcription_config;
  }

  /**
   * Sorts the list from A-Z, comparing the content-attributes.
   */
  sortAlphabetically(): void {
    this.transcription_config.additional_vocab.sort((a, b) => {
      const contentA = a.content.toLowerCase();
      const contentB = b.content.toLowerCase();
      return contentA.localeCompare(contentB);
    });
  }

  /**
   * Sorts the list from Z-A, comparing the content-attributes.
   */
  sortReverseAlphabetically(): void {
    this.transcription_config.additional_vocab.sort((a, b) => {
      const contentA = a.content.toLowerCase();
      const contentB = b.content.toLowerCase();
      return contentB.localeCompare(contentA);
    });
  }
}
