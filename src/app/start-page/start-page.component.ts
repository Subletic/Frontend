import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DictionaryError } from '../data/error/DictionaryError';
import { ConfigurationService } from '../service/configuration.service';
import { DictionaryEditorComponent } from './dictionary/dictionary-editor/dictionary-editor.component';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent {
  @Output() showDictionary = new EventEmitter<boolean>();
  isContinuePopupOpen = false;

  @ViewChild(DictionaryEditorComponent, { static: false })
  editorComponent!: DictionaryEditorComponent;

  /**
   * Initializes the configuration service.
   * @param configurationService Reference to the configuration service.
   * @param toastr Service to display toasts
   */
  constructor(
    private configurationService: ConfigurationService,
    private toastr: ToastrService,
  ) {}

  /**
   * Callback function for exiting the configuration screen.
   */
  public continueToEditor(): void {
    if (!this.editorComponent) return;
    if (this.editorComponent.wordcount > 1000) {
      this.toastr.error(
        'Die Anzahl der Wörter im Dictionary überschreitet 1000. Bitte reduzieren Sie die Anzahl der Wörter.',
        'Warnung',
      );
      return;
    }

    try {
      this.configurationService.isConfigValid();
    } catch (e) {
      if (e instanceof DictionaryError) {
        this.toastr.error(e.message, 'Fehler');
        return;
      }
      this.toastr.error(
        'Konfiguration ist nicht gültig. Bitte überprüfen Sie Ihre Eingaben.',
        'Fehler',
      );
    }

    this.showDictionary.emit(false);
    this.configurationService.postConfigurationToBackend();
  }

  openContinuePopup() {
    this.isContinuePopupOpen = true;
  }

  closeContinuePopup() {
    this.isContinuePopupOpen = false;
  }
}
