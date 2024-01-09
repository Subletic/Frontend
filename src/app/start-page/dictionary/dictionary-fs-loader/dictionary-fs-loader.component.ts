import { Component } from '@angular/core';
import { dictionary } from '../../../data/dictionary/dictionary.model';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from '../../../service/configuration.service';
import { DictionaryError } from '../../../data/error/DictionaryError';
import { CsvHandler } from './dictionary-export/dictionary-format-csv';
import { JsonHandler } from './dictionary-export/dictionary-format-json';
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
  ) { }

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

    // Check file extension to determine the file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    const DICTIONARY = await this.loadDictionaryFromFile(file, fileExtension);

    if (DICTIONARY != null) {
      this.configurationService.newDictionaryUpload(DICTIONARY);

      this.displayDictionarySuccessToast();
    }
  }

  /**
   * Loads a dictionary from a file and performs format-specific handling.
   * @param file - The file to load.
   * @param format - The file format (e.g., 'json' or 'csv').
   */
  private loadDictionaryFromFile(
    file: File,
    format: string | undefined,
  ): Promise<dictionary | null> {
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    return new Promise((resolve) => {
      fileReader.onload = () => {
        try {
          const fileString = fileReader.result as string;
          let formatHandler;
          switch (format) {
            case 'csv':
              formatHandler = new CsvHandler();
              break;
            case 'json':
              formatHandler = new JsonHandler();
              break;
            default:
              throw new DictionaryError(
                'Unsupported file format. Please select a JSON or CSV file.',
              );
          }
          const dictionary = formatHandler.convertToDictionary(fileString);
          this.validateDictionary(dictionary);
          if (dictionary == null) {
            resolve(null);
            return;
          }
          resolve(dictionary);
        } catch (e) {
          if (e instanceof DictionaryError) this.displayDictionaryErrorToast(e.message);
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
   * Validates the file structure of the provided dictionary.
   * @param dictionary Dictionary to validate
   * @throws DictionaryError if the dictionary is invalid
   */
  private validateDictionary(dictionary: dictionary): void {
    // Check if language is provided
    if (!dictionary.transcription_config.language)
      throw new DictionaryError('Keine Sprache angegeben!');

    // Check if additional vocab is valid
    const ADDITIONAL_VOCAB = dictionary.transcription_config.additional_vocab;
    if (!ADDITIONAL_VOCAB) throw new DictionaryError('Kein SoundsLike angegeben!');

    if (ADDITIONAL_VOCAB.length > 1000)
      throw new DictionaryError('Maximale Anzahl überschritten (1000)!');

    for (let i = 0; i < ADDITIONAL_VOCAB.length; i++) {
      const vocabItem = ADDITIONAL_VOCAB[i];

      // Check if content is provided and not empty or just whitespace
      if (!vocabItem.content || vocabItem.content.trim() === '')
        throw new DictionaryError('Content Angaben fehlerhaft!');

      // Check if sounds_like is provided and not empty
      const soundsLike = vocabItem.sounds_like;
      if (
        !soundsLike ||
        !Array.isArray(soundsLike) ||
        soundsLike.length === 0 ||
        soundsLike.some((s) => s.trim() === '')
      )
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
    return getComputedStyle(document.documentElement).getPropertyValue('--color-main-blue');
  }

  /**
   * Opens the export popup.
   */
  public openExportPopup() {
    this.isExportPopupOpen = true;
  }

  /**
   * Closes the export popup.
   */
  public closeExportPopup() {
    this.isExportPopupOpen = false;
  }

  /**
   * Retrieves the latest version of the dictionary from the configuration service.
   * @returns The updated dictionary.
   */
  public getUpdatedDictionary(): dictionary {
    return this.configurationService.getDictionary();
  }
}
