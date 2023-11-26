import { Component } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';
import { dictionary } from '../../data/dictionary/dictionary.model';
import { ToastrService } from 'ngx-toastr';

/**
 * Dictionary Filesystem Loader Component
 * This component provides import/export buttons for the dictionary.
 */
@Component({
  selector: 'app-dictionary-fs-loader',
  templateUrl: './dictionary-fs-loader.component.html',
  styleUrls: ['./dictionary-fs-loader.component.scss'],
})
export class DictionaryFsLoaderComponent {
  /**
   * Gets configurationService from dependency injection.
   * @param configurationService Service to manage the dictionary
   * @param toastr Service to display toasts
   */
  public constructor(
    private configurationService: ConfigurationService,
    private toastr: ToastrService,
  ) {}

  /**
   * Called when the user uploads a file.
   * @param event JSON file uploading event
   */
  public async handleFileUpload(event: Event): Promise<void> {
    const INPUT = event.target as HTMLInputElement;

    if (INPUT.files == null || INPUT.files[0] == null) {
      this.displayDictionaryErrorToast();
      return;
    }

    const file: File = INPUT.files[0];
    const DICTIONARY = await this.loadDictionaryFromFile(file);

    if (DICTIONARY == null) {
      this.displayDictionaryErrorToast();
      return;
    }

    this.configurationService.updateDictionary(DICTIONARY);
  }

  /**
   * Reads a JSON file and posts its content to the configurationService.
   * If the file is not a valid JSON file, null is returned.
   * @param file JSON file to read
   */
  private loadDictionaryFromFile(file: File): Promise<dictionary | null> {
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    return new Promise((resolve) => {
      fileReader.onload = () => {
        try {
          const dictionary = JSON.parse(fileReader.result as string);
          const dictionaryValid: boolean = this.validateDictionary(dictionary);
          if (dictionary == null || !dictionaryValid) {
            resolve(null);
            return;
          }
          this.displayDictionarySuccessToast();
          resolve(dictionary);
        } catch (e) {
          console.log(e);
          resolve(null);
        }
      };
      fileReader.onerror = () => {
        resolve(null);
      };
    });
  }

  /**
   * Validates the file structure of the provided json.
   * @param dictionary Dictionary to validate
   * @returns true if the dictionary is valid, false otherwise
   */
  private validateDictionary(dictionary: dictionary): boolean {
    // Check if language is provided
    if (!dictionary.transcription_config.language) return false;

    // Check if additional vocab is valid
    const ADDITIONAL_VOCAB = dictionary.transcription_config.additional_vocab;
    if (!ADDITIONAL_VOCAB) return false;

    for (let i = 0; i < ADDITIONAL_VOCAB.length; i++) {
      if (ADDITIONAL_VOCAB[i].content == null) return false;
    }

    return true;
  }

  /**
   * Called when the user clicks the download button.
   * Downloads the current dictionary as a JSON file.
   */
  public handleDictionaryDownload(): void {
    const DICTIONARY = this.configurationService.getDictionary();
    const DICTIONARY_STRING = JSON.stringify(DICTIONARY, null, 2);

    const BLOB = new Blob([DICTIONARY_STRING], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(BLOB);
    link.download = 'dictionary.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  /**
   * Displays an error toast when the user uploads an invalid file.
   * @private
   */
  public displayDictionarySuccessToast(): void {
    try {
      this.toastr.success('Dictionary wurde erfolgreich geladen!');
    } catch (e) {
      console.log('Dictionary wurde erfolgreich geladen!');
    }
  }

  /**
   * Displays an error toast when the user uploads an invalid file.
   * @private
   */
  public displayDictionaryErrorToast(): void {
    try {
      this.toastr.error('Ungültige Datei!', 'Fehler');
    } catch (e) {
      console.error('Ungültige Datei!');
    }
  }
}
