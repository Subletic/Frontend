import { Component, ViewChild, ElementRef } from '@angular/core';

/**
 * Component representing the hotkey menu.
 */
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

  /**
   * Booleans indicating whether the buttons are pressed.
   */
  public menuButtonPressed = false;
  public hotkeyButtonPressed = false;
  public footButtonPressed = false;
  public handButtonPressed = false;

  /**
   * Object holding image paths for different button states.
   */
  private buttonImages: {
    [key: string]: { normal: string; clicked: string };
  } = {
      menu: {
        normal: 'assets/burgermenu.svg',
        clicked: 'assets/burgermenu_onclick.svg',
      },
      foot: {
        normal: 'assets/footButton.svg',
        clicked: 'assets/footButton_onclick.svg',
      },
      hand: {
        normal: 'assets/handButton.svg',
        clicked: 'assets/handButton_onclick.svg',
      },
      hotkey: {
        normal: 'assets/hotkeyButton.svg',
        clicked: 'assets/hotkeyButton_onclick.svg',
      },
    };

  constructor() {
    this.menuImage = {} as ElementRef;
    this.footImage = {} as ElementRef;
    this.handImage = {} as ElementRef;
    this.hotkeyImage = {} as ElementRef;
  }

  /**
   * Updates the button state based on the button type.
   * @param {string} buttonType - Type of the button ('menu', 'hotkey', 'foot', 'hand').
   */
  public updateButtonState(buttonType: string): void {
    this.menuButtonPressed = buttonType === 'menu' ? !this.menuButtonPressed : true;
    this.hotkeyButtonPressed = buttonType === 'hotkey' ? !this.hotkeyButtonPressed : false;
    this.footButtonPressed = buttonType === 'foot' ? !this.footButtonPressed : false;
    this.handButtonPressed = buttonType === 'hand' ? !this.handButtonPressed : false;
  }

  /**
   * Updates the image source based on the button state.
   * @param {ElementRef} button - Reference to the button element.
   * @param {boolean} buttonClicked - Boolean indicating whether the button is clicked.
   * @param {string} buttonType - Type of the button ('menu', 'hotkey', 'foot', 'hand').
   */
  private updateButtonImage(button: ElementRef, buttonClicked: boolean, buttonType: string): void {
    const normalImgPath = this.buttonImages[buttonType].normal;
    const clickedImgPath = this.buttonImages[buttonType].clicked;
    button.nativeElement.src = buttonClicked ? clickedImgPath : normalImgPath;
  }

  /**
   * Updates the image of the specified button based on its state.
   * @param {boolean} clicked - Boolean indicating whether the button is clicked.
   * @param {string} buttonType - Type of the button ('menu', 'hotkey', 'foot', 'hand').
   */
  public updateImage(clicked: boolean, buttonType: string): void {
    switch (buttonType) {
      case 'menu':
        this.updateButtonImage(this.menuImage, clicked, buttonType);
        break;
      case 'foot':
        this.updateButtonImage(this.footImage, clicked, buttonType);
        break;
      case 'hand':
        this.updateButtonImage(this.handImage, clicked, buttonType);
        break;
      case 'hotkey':
        this.updateButtonImage(this.hotkeyImage, clicked, buttonType);
        break;
      default:
        break;
    }
  }
}
