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

    if (INPUT.files && INPUT.files.length > 0) {
      const file: File | null = INPUT.files[0];

      if (file !== null) {
        // Check file extension to determine the file type
        const FILE_EXTENSION = file.name.split('.').pop()?.toLowerCase();

        const DICTIONARY = await this.loadDictionaryFromFile(file, FILE_EXTENSION);

        if (DICTIONARY != null) {
          this.configurationService.newDictionaryUpload(DICTIONARY);
          this.displayDictionarySuccessToast();
        }
      } else {
        this.displayDictionaryErrorToast();
      }
    } else {
      this.displayDictionaryErrorToast();
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
          const FILE_STRING = fileReader.result as string;
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
                'Dateiformat wird nicht unterstützt. Bitte wählen Sie eine JSON oder CSV Datei.',
              );
          }
          const DICTIONARY = formatHandler.convertToDictionary(FILE_STRING);
          this.validateDictionary(DICTIONARY);
          if (DICTIONARY == null) {
            resolve(null);
            return;
          }
          resolve(DICTIONARY);
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
    // Check if additional vocab is valid
    const ADDITIONAL_VOCAB = dictionary.transcription_config.additional_vocab;
    const LANGUAGE = dictionary.transcription_config.language;
    if (!ADDITIONAL_VOCAB) throw new DictionaryError('Es sind weder benutzerdefinierte Wörter noch klangähnliche Wörter in der Datei angegeben!');

    if (ADDITIONAL_VOCAB.length > 1000)
      this.displayDictionaryWarningToast('Maximale Anzahl an Wörterbucheinträgen überschritten (1000)!');

    for (let i = 0; i < ADDITIONAL_VOCAB.length; i++) {
      const vocabItem = ADDITIONAL_VOCAB[i];
      const soundsLike = vocabItem.sounds_like;
      const content = vocabItem.content;
      const filteredSoundsLike = soundsLike?.filter((s) => s.trim() !== '') ?? [];

      // Check if content is provided and not empty or just whitespace
      if ((!content || content.trim() == '') && filteredSoundsLike.length > 0)
        this.displayDictionaryWarningToast('In mind. einer Zeile wurde zu einem klangähnlichen Wort kein benutzerdefiniertes Wort angegeben!');
    }

    if (!LANGUAGE) {
      this.displayDictionaryWarningToast(
        'Es wurde keine Sprache des Wörterbuchs angegeben. Die Sprache wurde jetzt automatisch auf Deutsch gesetzt.');
    } else if (LANGUAGE != 'de') {
      this.displayDictionaryWarningToast(
        'Die Sprache des Wörterbuchs muss Deutsch sein. Die Sprache wurde jetzt automatisch auf Deutsch gesetzt.');
    }
  }

  /**
   * Displays an error toast when the user uploads an invalid file.
   * @private
   */
  public displayDictionarySuccessToast(): void {
    try {
      this.toastr.success('Wörterbuch wurde erfolgreich geladen!');
    } catch (e) {
      console.log('Wörterbuch wurde erfolgreich geladen!');
    }
  }

  public displayDictionaryWarningToast(warningMessage: string): void {
    try {
      this.toastr.warning(warningMessage, 'Warnung', { timeOut: 8000, extendedTimeOut: 8000 });
    } catch (e) {
      console.log(warningMessage);
    }
  }

  /**
   * Displays an error toast when the user uploads an invalid file.
   * @param errorMessage Error message to display
   */
  public displayDictionaryErrorToast(errorMessage = 'Es ist ein Fehler aufgetreten'): void {
    try {
      this.toastr.error(errorMessage, 'Fehler', { timeOut: 8000, extendedTimeOut: 8000 });
    } catch (e) {
      console.error('Es ist ein Fehler aufgetreten');
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
