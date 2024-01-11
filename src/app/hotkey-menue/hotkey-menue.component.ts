import { Component } from '@angular/core';

@Component({
  selector: 'app-hotkey-menue',
  templateUrl: './hotkey-menue.component.html',
  styleUrls: ['./hotkey-menue.component.scss']
})
export class HotkeyMenueComponent {

  public showButtons = false;
  public hotkeyButtonPressed = false;
  public footButtonPressed = false;
  public handButtonPressed = false;

  public toggleButtons(): void {
    this.showButtons = !this.showButtons;
    this.hotkeyButtonPressed = false;
    this.footButtonPressed = false;
    this.handButtonPressed = false;
  }

  public showHotkeys(): void {
    this.hotkeyButtonPressed = !this.hotkeyButtonPressed;
    this.footButtonPressed = false;
    this.handButtonPressed = false;
  }

  public showFootswitch(): void {
    this.footButtonPressed = !this.footButtonPressed;
    this.hotkeyButtonPressed = false;
    this.handButtonPressed = false;
  }

  public showHandswitch(): void {
    this.handButtonPressed = !this.handButtonPressed;
    this.hotkeyButtonPressed = false;
    this.footButtonPressed = false;
  }
}
