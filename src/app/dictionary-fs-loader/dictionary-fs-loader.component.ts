import {Component} from '@angular/core';
import {DictionaryService} from "../service/dictionary.service";
import {dictionary} from "../data/dictionary/dictionary.model";
import {ToastrService} from "ngx-toastr";


/**
 * This component provides import/export buttons for the dictionary.
 */
@Component({
  selector: 'app-dictionary-fs-loader',
  templateUrl: './dictionary-fs-loader.component.html',
  styleUrls: ['./dictionary-fs-loader.component.scss']
})
export class DictionaryFsLoaderComponent {

  /**
   * Gets dictionaryService from dependency injection.
   * @param dictionaryService Service to manage the dictionary
   * @param toastr Service to display toasts
   */
  constructor(private dictionaryService: DictionaryService, private toastr: ToastrService) {
  }

  /**
   * Called when the user uploads a file.
   * @param event JSON file uploading event
   */
  public handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files == null) {
      return;
    }

    const file: File = input.files[0];

    this.loadDictionaryFromFile(file);
  }

  /**
   * Reads a JSON file and posts its content to the dictionaryService.
   * If the file is not a valid JSON file, null is returned.
   * @param file JSON file to read
   */
  private loadDictionaryFromFile(file: File): void {
    const fileReader = new FileReader();

    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = () => {
      try {
        const dictionary = JSON.parse(fileReader.result as string);

        const dictionaryValid: boolean = this.validateDictionary(dictionary);

        if (dictionary == null || !dictionaryValid) {
          this.loadDictionaryErrorToast();
          return;
        }

        this.toastr.success("Dictionary wurde erfolgreich geladen!");
        this.dictionaryService.updateDictionary(dictionary);
      } catch (e) {
        this.loadDictionaryErrorToast();
      }
    }
    fileReader.onerror = (error) => {
      this.loadDictionaryErrorToast();
      console.log(error);
    }
  }

  /**
   * Validates the file structure of the provided json.
   * @param dictionary Dictionary to validate
   * @returns true if the dictionary is valid, false otherwise
   */
  private validateDictionary(dictionary: dictionary): boolean {
    // Check if language is provided
    if (dictionary.transcription_config.language == null) {
      return false;
    }

    // Check if additional vocab is valid
    const additionalVocab = dictionary.transcription_config.additional_vocab;
    if (additionalVocab != null) {
      for (let i = 0; i < additionalVocab.length; i++) {
        if (additionalVocab[i].content == null) {
          return false;
        }
      }
    } else {
      return false;
    }

    return true;
  }

  /**
   * Displays an error toast when the user uploads an invalid file.
   * @private
   */
  private loadDictionaryErrorToast(): void {
    this.toastr.error("Ungültige Datei!", "Fehler")
  }

  /**
   * Returns the background color of the application.
   * Used for Button styling.
   */
  getBackgroundColor(): string {
    return getComputedStyle(document.documentElement).getPropertyValue('--color-main-blue');
  }
}
