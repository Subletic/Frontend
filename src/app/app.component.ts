import { Component, ViewChild } from '@angular/core';
import { ConfigurationService } from './service/configuration.service';
import { SoundBoxComponent } from './sound-box/sound-box.component';
import { Router } from '@angular/router';

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

  @ViewChild('soundBox', { static: false }) set content(content: SoundBoxComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.soundBox = content;
      const bufferLengthInMinutes = this.configurationService.getBufferLengthInMinutes();
      this.soundBox?.initAudioContexts(bufferLengthInMinutes);
    }
  }

  /**
   * Initializes the configuration service.
   * @param configurationService Reference to the configuration service.
   */
  constructor(
    private configurationService: ConfigurationService,
    private router: Router,
  ) {}

  public handleShowDictionary(showDictionary: boolean) {
    this.showDictionary = showDictionary;
  }

  shouldRenderContent(): boolean {
    console.log(this.router.url !== '/FAQ');
    return this.router.url !== '/FAQ';
  }
}
