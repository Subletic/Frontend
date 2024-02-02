import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoSpecialChars]'
})
export class NoSpecialCharsDirective {

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const allowedChars = /^[a-zA-ZäöüÄÖÜß-]*$/;

    if (!allowedChars.test(event.key)) {
      event.preventDefault();
    }
  }
}
