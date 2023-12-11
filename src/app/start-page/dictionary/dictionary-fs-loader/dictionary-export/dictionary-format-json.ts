import { FormatHandler } from './dictionary-format-handler.interface';
import { dictionary } from '../../../../data/dictionary/dictionary.model';

/**
 * Class for exporting data in JSON format.
 * @class
 * @implements {ExportFormat}
 */
export class JsonFormat implements FormatHandler {
  download(fileName: string, dictionary: dictionary): void {
    const DICTIONARY_STRING = JSON.stringify(dictionary, null, 2);

    const BLOB = new Blob([DICTIONARY_STRING], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(BLOB);
    link.download = fileName === '' ? 'dictionary.json' : `${fileName}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  upload(): void {
    return;
  }
}
