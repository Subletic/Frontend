/*
from Jason Watmore (@cornflourblue) https://github.com/cornflourblue/angular-9-custom-modal
*/
import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from './settings.service';


@Component({ 
    selector: 'settings-modal', 
    templateUrl: 'settings.component.html', 
    styleUrls: ['settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit, OnDestroy {
    @Input() id!: string;
    private element: any;

    constructor(private settingsService: SettingsService, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // close modal on background click
        this.element.addEventListener('click', (el: MouseEvent) => {
            if (el.target instanceof HTMLElement && el.target.className === 'settings-modal') {
                this.close();
            }
        });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.settingsService.add(this);
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.settingsService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('settings-modal-open');
    }

    // close modal
    close(): void {
        this.element.style.display = 'none';
        document.body.classList.remove('settings-modal-open');
    }
}