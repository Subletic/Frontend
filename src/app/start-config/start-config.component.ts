import {Component} from '@angular/core';

@Component({
  selector: 'app-start-config',
  templateUrl: './start-config.component.html',
  styleUrls: ['./start-config.component.scss'],
})
export class StartConfigComponent {

  private selectedBufferLength = 2;

  public formatSliderValues(value: number): string {
    const BUFFER_LENGTHS: number[] = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10]
    return BUFFER_LENGTHS[value].toString();
  }

  public updateSelectedBufferLength(event: Event): void {
    const BUFFER_LENGTHS: number[] = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10]
    const SLIDER_VALUE: string = (event.target as HTMLInputElement).value;

    this.selectedBufferLength = BUFFER_LENGTHS[+SLIDER_VALUE];
    console.log(this.selectedBufferLength)
  }

  public getSelectedBufferLength(): number {
    return this.selectedBufferLength;
  }
}
