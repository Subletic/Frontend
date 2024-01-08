import { DictionaryFileFormatHandler } from './dictionary-format-handler.interface';
import { dictionary } from '../../../../data/dictionary/dictionary.model';
import { additional_vocab } from '../../../../data/dictionary/additionalVocab.model';
import { transcription_config } from '../../../../data/dictionary/transcription_config.module';

/**
 * Class for exporting/importing data in CSV format.
 * @class
 * @implements {DictionaryFileFormatHandler}
 */
export class CsvHandler implements DictionaryFileFormatHandler {
  public downloadDictionary(fileName: string, dictionary: dictionary): void {
    const CSV_CONTENT = this.convertDictionaryToCsv(dictionary);
    const BLOB = new Blob([CSV_CONTENT], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(BLOB);
    link.download = fileName === '' ? 'dictionary.csv' : `${fileName}`;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  /**
   * Converts a CSV-formatted string to a dictionary object.
   * @param csvContent CSV-formatted string of the dictionary
   * @returns Converted dictionary object
   */
  public convertToDictionary(csvDictionary: string): dictionary {
    const rows = csvDictionary.split('\r');
    const additionalVocab: additional_vocab[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].split(';');

      if (row[0].trim() === '') {
        continue;
      }

      if (
        i === 0 &&
        row[0].toLowerCase() === 'content' &&
        row[1].toLowerCase().replace(/\s/g, '') === 'soundslike'
      ) {
        continue;
      }

      const content = row[0];
      const soundsLike = row.slice(1);

      const filteredSoundsLike = soundsLike.filter((s) => s.trim() !== '');

      const vocabItem = new additional_vocab(content, filteredSoundsLike);
      additionalVocab.push(vocabItem);
    }

    const transcriptionConfig = new transcription_config('de', additionalVocab);
    const convertedDictionary = new dictionary(transcriptionConfig);

    return convertedDictionary;
  }

  /**
   * Converts the dictionary to a CSV-formatted string.
   * @param dictionary Dictionary to convert
   * @returns CSV-formatted string
   */
  private convertDictionaryToCsv(dictionary: dictionary): string {
    const rows: string[] = [];

    const row = dictionary.transcription_config.additional_vocab.map((vocabItem) => {
      const content = vocabItem.content || '';
      const soundsLike = vocabItem.sounds_like ? vocabItem.sounds_like.join(';') : '';
      return [content, soundsLike].join(';');
    });

    rows.push('Content;SoundsLike');
    rows.push(...row);

    return rows.join('\r');
  }
}
