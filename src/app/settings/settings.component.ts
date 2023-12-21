import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SettingsService } from './settings.service';
import { BackendProviderService } from '../service/backend-provider.service';

/**
 * The SettingsComponent represents a settings modal that allows users to configure certain options.
 * It is based on Jason Watmore's custom modal implementation (https://github.com/cornflourblue/angular-9-custom-modal).
 */
@Component({
  selector: 'app-settings',
  templateUrl: 'settings.component.html',
  styleUrls: [
    'settings.component.scss',
    '../sound-box/slider-popup/slider-popup.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() id!: string; // The unique identifier for the settings modal
  @Output() secondsChange = new EventEmitter<number>(); // Event emitter to notify parent components of changes

  @ViewChild('secondsSlider', { static: false })
  secondsSlider!: ElementRef<HTMLInputElement>;

  public initialAudioSkipSeconds = 5;
  @Input() updatedAudioSkipSeconds = this.initialAudioSkipSeconds;

  private element!: HTMLElement;

  constructor(
    private settingsService: SettingsService,
    private backendProviderService: BackendProviderService,
    private el: ElementRef<HTMLElement>,
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    // Ensure that the "id" attribute exists for the modal
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    // Move the element to the bottom of the page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    this.setupSlider();

    // Close the modal when clicking on the background
    this.element.addEventListener('click', (el: MouseEvent) => {
      if (
        el.target instanceof HTMLElement &&
        el.target.className === 'settings'
      ) {
        this.cancel();
      }
    });

    // Add this modal instance to the settings service so it can be accessed from other components
    this.settingsService.add(this);
  }

  ngAfterViewInit(): void {
    this.secondsSlider.nativeElement.value =
      this.updatedAudioSkipSeconds.toString();
    this.setupSlider();
  }

  // Remove this modal instance from the settings service when the component is destroyed
  ngOnDestroy(): void {
    this.settingsService.remove(this.id);
    this.element.remove();
  }

  // Open the modal and display it on the screen
  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('settings-open');
    this.initialAudioSkipSeconds = this.updatedAudioSkipSeconds;
    this.setupSlider();
  }

  // Close the modal and hide it from the screen
  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('settings-open');
    this.setupSlider();
  }

  // Cancels changes, resets seconds value and closes modal
  cancel(): void {
    this.updatedAudioSkipSeconds = this.initialAudioSkipSeconds;
    this.close();
  }

  // Apply the settings changes and emit the "secondsChange" event to notify the parent component
  apply(): void {
    this.secondsChange.emit(this.updatedAudioSkipSeconds);
    this.close();
  }

  /**
   * Sets up the slider so it has a colored bar from left to the thumb
   */
  setupSlider(): void {
    const MIN_SKIP_SECONDS = '1';
    const MAX_SKIP_SECONDS = '20';

    document
      .querySelectorAll<HTMLInputElement>('input[type="range"].slider-progress')
      .forEach((e: HTMLInputElement) => {
        e.style.setProperty('--value', e.value);
        e.style.setProperty('--min', e.min === '' ? MIN_SKIP_SECONDS : e.min);
        e.style.setProperty('--max', e.max === '' ? MAX_SKIP_SECONDS : e.max);
        e.addEventListener('input', () =>
          e.style.setProperty('--value', e.value),
        );
      });
  }

  // Get the background color defined in the CSS variable "--color-main-blue"
  getBackgroundColor(): string {
    return getComputedStyle(document.documentElement).getPropertyValue(
      '--color-main-blue',
    );
  }

  /** Calls reload request to backend, then reloads webpage after 2 seconds
   *
   */
  callBackendReload(): void {
    const MILLISECONDS_BEFORE_RELOADING_PAGE = 2000;
    this.backendProviderService.callBackendReload(
      MILLISECONDS_BEFORE_RELOADING_PAGE,
    );
  }
}
