import { dictionary } from '../../../../data/dictionary/dictionary.model';

/**
 * Interface defining the contract for export formats.
 * @interface
 */
export interface ExportFormat {
  /**
   * Downloads data in a specific file format.
   * @param {string} fileName - The name of the file to download.
   * @param {dictionary} dictionary - The dictionary data to be exported.
   * @returns {void}
   */
  download(fileName: string, dictionary: dictionary): void;

  upload(): void;
}
