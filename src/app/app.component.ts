import {Component, ViewChild} from '@angular/core';
import {ConfigurationService} from "./service/configuration.service";
import {SoundBoxComponent} from "./sound-box/sound-box.component";
import {ToastrService} from "ngx-toastr";

/**
 * Component containing the main page of the software.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showDictionary = true;
  title = 'Frontend';

  private soundBox: SoundBoxComponent | undefined;

  @ViewChild('soundBox', {static: false}) set content(content: SoundBoxComponent) {
    if (content) { // initially setter gets called with undefined
      this.soundBox = content;
      const bufferLengthInMinutes = this.configurationService.getBufferLengthInMinutes();
      this.soundBox?.initAudioContexts(bufferLengthInMinutes);
    }
  }

  /**
   * Initializes the configuration service.
   * @param configurationService Reference to the configuration service.
   * @param toastr Service to display toasts
   */
  constructor(private configurationService: ConfigurationService, private toastr: ToastrService) {
  }

  /**
   * Callback function for exiting the configuration screen.
   */
  public continueToEditor(): void {
    if (!this.configurationService.isConfigValid()) {
      this.toastr.error("Konfiguration ist nicht gültig. Bitte überprüfen Sie Ihre Eingaben.");
      return;
    }

    this.showDictionary = false;
    this.configurationService.postConfigurationToBackend();
  }
}
