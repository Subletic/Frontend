import { DictionaryFileFormatHandler } from './dictionary-format-handler.interface';
import { dictionary } from '../../../../data/dictionary/dictionary.model';

/**
 * Class for exporting/importing data in JSON format.
 * @class
 * @implements {DictionaryFileFormatHandler}
 */
export class JsonHandler implements DictionaryFileFormatHandler {
  public downloadDictionary(fileName: string, dictionary: dictionary): void {
    const DICTIONARY_STRING = JSON.stringify(dictionary, null, 2);

    const BLOB = new Blob([DICTIONARY_STRING], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(BLOB);
    link.download = fileName === '' ? 'woerterbuch.json' : `${fileName}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  public convertToDictionary(jsonDictionary: string): dictionary {
    return JSON.parse(jsonDictionary);
  }
}
