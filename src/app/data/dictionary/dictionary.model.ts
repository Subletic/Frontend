import { additional_vocab } from './additionalVocab.model';
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

  /**
   * Merges two dictionaries by combining their additional_vocab lists.
   *
   * @param otherDictionary - second dictionary to merge into this instance
   */
  mergeWithDictionary(otherDictionary: dictionary): void {
    const mergedVocab = this.transcription_config.additional_vocab.concat(
      otherDictionary.transcription_config.additional_vocab,
    );
    const contentMap = new Map<string, additional_vocab>();

    mergedVocab.forEach((vocabItem) => {
      const existingItem = contentMap.get(vocabItem.content);

      if (existingItem) {
        const combinedSounds = new Set([
          ...(existingItem.sounds_like || []),
          ...(vocabItem.sounds_like || []),
        ]);
        existingItem.sounds_like = Array.from(combinedSounds);
      } else {
        contentMap.set(
          vocabItem.content,
          new additional_vocab(vocabItem.content, vocabItem.sounds_like),
        );
      }
    });

    const mergedArray = Array.from(contentMap.values());
    this.transcription_config.additional_vocab = mergedArray;
  }
}
