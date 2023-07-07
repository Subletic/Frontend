import { Component, ViewEncapsulation, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { SettingsService } from './settings.service';
import {environment} from "../../environments/environment";

/**
 * The SettingsComponent represents a settings modal that allows users to configure certain options.
 * It is based on Jason Watmore's custom modal implementation (https://github.com/cornflourblue/angular-9-custom-modal).
 */
@Component({ 
    selector: 'app-settings', 
    templateUrl: 'settings.component.html', 
    styleUrls: ['settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit, OnDestroy {
    @Input() id!: string;   // The unique identifier for the settings modal
    @Output() secondsChange = new EventEmitter<number>();   // Event emitter to notify parent components of changes
    private element!: HTMLElement;
    sprungweite = 5;
    initialSprungweite = 5;

    constructor(private settingsService: SettingsService, private el: ElementRef<HTMLElement>) {
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

        // Close the modal when clicking on the background
        this.element.addEventListener('click', (el: MouseEvent) => {
            if (el.target instanceof HTMLElement && el.target.className === 'settings') {
                this.close();
            }
        });

        // Add this modal instance to the settings service so it can be accessed from other components
        this.settingsService.add(this);
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
        this.initialSprungweite = this.sprungweite;
    }

    // Close the modal and hide it from the screen
    close(): void {
        this.element.style.display = 'none';
        document.body.classList.remove('settings-open');
    }

    cancel(): void {
        this.sprungweite = this.initialSprungweite;
        this.close();
    }

    // Apply the settings changes and emit the "secondsChange" event to notify the parent component
    apply() {
        this.secondsChange.emit(this.sprungweite);
        this.close();

    }

    // Check if the current "sprungweite" value is valid (between 1 and 120)
    checkSprungweite() {
        if (this.sprungweite > 120 || this.sprungweite < 1) {
          return false;
        }
        return true;
    }
    
     // Get the background color defined in the CSS variable "--color-main-blue"
    getBackgroundColor() : string {
        return getComputedStyle(document.documentElement).getPropertyValue('--color-main-blue');
    }

    /** Calls reload request to backend, then reloads webpage after 2 seconds
     * 
     */
    callBackendReload() {

        fetch(environment.apiURL + '/api/restart', {
          method: 'POST',
        })
          .then(response => {
            if (response.ok) {
              console.log('Called for restart');
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } else {
              console.error('Error with calling restart');
            }
          })
          .catch(error => {
            console.error('Error with calling restart:', error);
          });
      }
}