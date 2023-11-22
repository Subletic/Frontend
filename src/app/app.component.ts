import {Component} from '@angular/core';
import {ConfigurationService} from "./service/configuration.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showDictionary = true;
  title = 'Frontend';

  constructor(private configurationService: ConfigurationService) {
  }

  continueToEditor(): void {
    this.showDictionary = false;
    this.configurationService.postConfigurationToBackend();
  }

}
