import {Component} from '@angular/core';
import {ConfigurationService} from "../service/configuration.service";

/**
 * Component containing the configuration interface of the software.
 */
@Component({
  selector: 'app-start-config',
  templateUrl: './start-config.component.html',
  styleUrls: ['./start-config.component.scss'],
})
export class StartConfigComponent {

  public selectedBufferLength = 2;
  public selectedIndex = 2;

  /**
   * Initializes the component.
   * @param configurationService Reference to the configuration service.
   */
  constructor(private configurationService: ConfigurationService) {
  }

  public formatSliderValues(value: number): string {
    const BUFFER_LENGTHS: number[] = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10]
    return BUFFER_LENGTHS[value].toString();
  }

  public updateSelectedBufferLength(event: Event): void {
    const BUFFER_LENGTHS: number[] = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10]
    const SLIDER_VALUE: string = (event.target as HTMLInputElement).value;

    this.selectedIndex = +SLIDER_VALUE;
    this.selectedBufferLength = BUFFER_LENGTHS[+SLIDER_VALUE];
    this.configurationService.updateDelayLength(this.selectedBufferLength);
  }

  public getSelectedBufferLength(): number {
    return this.selectedBufferLength;
  }

}
