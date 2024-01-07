import { dictionary } from '../../../../data/dictionary/dictionary.model';

/**
 * Interface defining the contract for export/import formats.
 * @interface
 */
export interface DictionaryFileFormatHandler {
  /**
   * Downloads data in a specific file format.
   * @param {string} fileName - The name of the file to download.
   * @param {dictionary} dictionary - The dictionary data to be exported.
   * @returns {void}
   */
  downloadDictionary(fileName: string, dictionary: dictionary): void;

  convertToDictionary(stringifiedDictionary: string): dictionary;
}
