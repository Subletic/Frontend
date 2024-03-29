import { Component, Output, EventEmitter } from '@angular/core';
import { DictionaryFileFormatHandler } from '../dictionary-export/dictionary-format-handler.interface';
import { JsonHandler } from '../dictionary-export/dictionary-format-json';
import { CsvHandler } from '../dictionary-export/dictionary-format-csv';
import { DictionaryFsLoaderComponent } from '../dictionary-fs-loader.component';

/**
 * Export Popup Component
 * This component represents the popup for exporting dictionary data in different formats.
 */
@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.scss'],
})
export class ExportPopupComponent {
  @Output() closed = new EventEmitter<void>();
  public exportFileName = '';

  constructor(private dictionaryFsLoader: DictionaryFsLoaderComponent) {}

  /**
   * Closes the export popup.
   */
  close() {
    this.closed.emit();
  }

  /**
   * Called when the user clicks the download button.
   * Downloads the current dictionary as a JSON file.
   */
  public handleDictionaryDownloadJson(): void {
    const DICTIONARY = this.dictionaryFsLoader.getUpdatedDictionary();
    const exportFormat: DictionaryFileFormatHandler = new JsonHandler();
    exportFormat.downloadDictionary(this.exportFileName, DICTIONARY);
  }

  /**
   * Called when the user clicks the download button.
   * Downloads the current dictionary as a CSV file.
   */
  public handleDictionaryDownloadCsv(): void {
    const DICTIONARY = this.dictionaryFsLoader.getUpdatedDictionary();
    const exportFormat: DictionaryFileFormatHandler = new CsvHandler();
    exportFormat.downloadDictionary(this.exportFileName, DICTIONARY);
  }

  /**
   * Checks if the input field contains special characters and updates the UI accordingly.
   * @returns True if the input contains special characters, otherwise false.
   */
  public checkForSpecialCharacters(): boolean {
    const downloadButtons = document.querySelectorAll(
      '.download-button',
    ) as NodeListOf<HTMLButtonElement>;
    const inputField = document.getElementById('fileNameInput') as HTMLInputElement;
    const inputValue = inputField.value;

    const SPECIALCHARACTERS = ['/', '\\', ':', '*', '?', '"', '<', '>', '|'];

    const containsSpecialCharacter = SPECIALCHARACTERS.some((char) => inputValue.includes(char));

    if (containsSpecialCharacter) {
      inputField.style.border = '1px solid red';
      inputField.style.outline = '1px solid red';
      downloadButtons.forEach((button) => {
        button.disabled = true;
      });
      return true;
    }

    inputField.style.border = '';
    inputField.style.outline = '';
    downloadButtons.forEach((button) => {
      button.disabled = false;
    });

    return false;
  }
}
