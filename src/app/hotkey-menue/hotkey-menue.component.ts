import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hotkey-menue',
  templateUrl: './hotkey-menue.component.html',
  styleUrls: ['./hotkey-menue.component.scss']
})
export class HotkeyMenueComponent {

  @ViewChild('menuImage', { static: false }) menuImage: ElementRef;
  @ViewChild('footImage', { static: false }) footImage: ElementRef;
  @ViewChild('handImage', { static: false }) handImage: ElementRef;
  @ViewChild('hotkeyImage', { static: false }) hotkeyImage: ElementRef;
  public showButtons = false;
  public hotkeyButtonPressed = false;
  public footButtonPressed = false;
  public handButtonPressed = false;

  constructor() {
    this.menuImage = {} as ElementRef;
    this.footImage = {} as ElementRef;
    this.handImage = {} as ElementRef;
    this.hotkeyImage = {} as ElementRef;
  }

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

  updateMenuButtonImage(menuclicked: boolean) {
    if (menuclicked) {
      this.menuImage.nativeElement.src = 'assets/burgermenu_onclick.svg';
    } else {
      this.menuImage.nativeElement.src = 'assets/burgermenu.svg';
    }
  }

  updateFootButtonImage(footclicked: boolean) {
    if (footclicked) {
      this.footImage.nativeElement.src = 'assets/footButton_onclick.svg';
    } else {
      this.footImage.nativeElement.src = 'assets/footButton.svg';
    }
  }

  updateHandButtonImage(handclicked: boolean) {
    if (handclicked) {
      this.handImage.nativeElement.src = 'assets/handButton_onclick.svg';
    } else {
      this.handImage.nativeElement.src = 'assets/handButton.svg';
    }
  }

  updateHotkeyButtonImage(hotkeyclicked: boolean) {
    if (hotkeyclicked) {
      this.hotkeyImage.nativeElement.src = 'assets/hotkeyButton_onclick.svg';
    } else {
      this.hotkeyImage.nativeElement.src = 'assets/hotkeyButton.svg';
    }
  }
}
