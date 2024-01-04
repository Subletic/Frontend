import { ExportFormat } from './dictionary-export.interface';
import { dictionary } from '../../../../data/dictionary/dictionary.model';

/**
 * Class for exporting data in CSV format.
 * @class
 * @implements {ExportFormat}
 */
export class CsvExport implements ExportFormat {
  download(fileName: string, dictionary: dictionary): void {
    const CSV_CONTENT = this.convertDictionaryToCsv(dictionary);
    const BLOB = new Blob([CSV_CONTENT], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(BLOB);
    link.download = fileName === '' ? 'dictionary.csv' : `${fileName}`;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  upload(): void {
    return;
  }

  /**
   * Converts the dictionary to a CSV-formatted string.
   * @param dictionary Dictionary to convert
   * @returns CSV-formatted string
   */
  private convertDictionaryToCsv(dictionary: dictionary): string {
    const rows: string[] = [];

    const dataRows = dictionary.transcription_config.additional_vocab.map((vocabItem) => {
      const content = vocabItem.content || '';
      const soundsLike = vocabItem.sounds_like ? vocabItem.sounds_like.join(';') : '';
      return [content, soundsLike].join(';');
    });

    rows.push('Content;SoundsLike');
    rows.push(...dataRows);

    return rows.join('\n');
  }
}
