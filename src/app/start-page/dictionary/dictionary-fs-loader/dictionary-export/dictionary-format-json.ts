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
    link.download = fileName === '' ? 'dictionary.json' : `${fileName}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  /**
   * Reads a JSON file and posts its content to the configurationService.
   * If the file is not a valid JSON file, null is returned.
   * @param file JSON file to read
   * 
  public uploadDictionary(file: File): Promise<dictionary | null> {
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    return new Promise((resolve) => {
      fileReader.onload = () => {
        try {
          const dictionary = JSON.parse(fileReader.result as string);
          this.dictionaryFsLoader.validateDictionary(dictionary);
          if (dictionary == null) {
            resolve(null);
            return;
          }
          this.dictionaryFsLoader.displayDictionarySuccessToast();
          resolve(dictionary);
        } catch (e) {
          if (e instanceof DictionaryError)
            this.dictionaryFsLoader.displayDictionaryErrorToast(e.message);
          else this.dictionaryFsLoader.displayDictionaryErrorToast();
          console.log(e);
          resolve(null);
        }
      };
      fileReader.onerror = () => {
        resolve(null);
      };
    });
  }
  */
}
