import { Component, Output, EventEmitter } from '@angular/core';
import { ExportFormat } from '../dictionary-export/dictionary-export.interface';
import { JsonExport } from '../dictionary-export/dictionary-export-json';
import { CsvExport } from '../dictionary-export/dictionary-export-csv';
import { DictionaryFsLoaderComponent } from '../dictionary-fs-loader.component';

/**
 * Export Popup Component
 * This component represents the popup for exporting dictionary data in different formats.
 */
@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.scss']
})
export class ExportPopupComponent {

  @Output() closed = new EventEmitter<void>();
  public exportFileName = "";

  constructor(private dictionaryFsLoader: DictionaryFsLoaderComponent) { }

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
    const exportFormat: ExportFormat = new JsonExport();
    exportFormat.download(this.exportFileName, DICTIONARY);
  }

  /**
   * Called when the user clicks the download button.
   * Downloads the current dictionary as a CSV file.
   */
  public handleDictionaryDownloadCsv(): void {
    const DICTIONARY = this.dictionaryFsLoader.getUpdatedDictionary();
    const exportFormat: ExportFormat = new CsvExport();
    exportFormat.download(this.exportFileName, DICTIONARY);
  }
}
