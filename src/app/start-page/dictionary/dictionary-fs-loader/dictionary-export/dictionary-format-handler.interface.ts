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

  /**
   * Converts a string representation of a dictionary in a specific format to a dictionary object.
   * @param {string} stringifiedDictionary - The stringified dictionary data to be converted.
   * @returns {dictionary} - The converted dictionary object.
   */
  convertToDictionary(stringifiedDictionary: string): dictionary;
}
