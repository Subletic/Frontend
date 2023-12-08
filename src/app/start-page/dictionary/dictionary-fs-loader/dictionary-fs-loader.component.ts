import { Component } from '@angular/core';
import { dictionary } from '../../../data/dictionary/dictionary.model';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from '../../../service/configuration.service';
import { DictionaryError } from '../../../data/error/DictionaryError';

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
  isExportPopupOpen = false;

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
          this.validateDictionary(dictionary);
          if (dictionary == null) {
            resolve(null);
            return;
          }
          this.displayDictionarySuccessToast();
          resolve(dictionary);
        } catch (e) {
          if (e instanceof DictionaryError)
            this.displayDictionaryErrorToast(e.message);
          else this.displayDictionaryErrorToast();
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
   * @throws DictionaryError if the dictionary is invalid
   */
  private validateDictionary(dictionary: dictionary): void {
    // Check if language is provided
    if (!dictionary.transcription_config.language)
      throw new DictionaryError('Keine Sprache angegeben!');

    // Check if additional vocab is valid
    const ADDITIONAL_VOCAB = dictionary.transcription_config.additional_vocab;
    if (!ADDITIONAL_VOCAB)
      throw new DictionaryError('Kein SoundsLike angegeben!');

    if (ADDITIONAL_VOCAB.length > 1000)
      throw new DictionaryError(
        'Maximale SoundsLike Anzahl überschritten (1000)!',
      );

    for (let i = 0; i < ADDITIONAL_VOCAB.length; i++) {
      if (!ADDITIONAL_VOCAB[i].content)
        throw new DictionaryError('SoundsLike Angaben fehlerhaft!');
    }
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
   * @param errorMessage Error message to display
   */
  public displayDictionaryErrorToast(errorMessage = 'Ungültige Datei!'): void {
    try {
      this.toastr.error(errorMessage, 'Fehler');
    } catch (e) {
      console.error('Ungültige Datei!');
    }
  }

  /**
   * Returns the background color of the application.
   * Used for Button styling.
   */
  public getBackgroundColor(): string {
    return getComputedStyle(document.documentElement).getPropertyValue(
      '--color-main-blue',
    );
  }

  openExportPopup() {
    this.isExportPopupOpen = true;
  }

  closeExportPopup() {
    this.isExportPopupOpen = false;
  }

  getUpdatedDictionary(): dictionary {
    return this.configurationService.getDictionary();
  }
}
