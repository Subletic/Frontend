/*
 * This service provides functionality to manage settings modals in the application.
 * It is based on Jason Watmore's custom modal implementation (https://github.com/cornflourblue/angular-9-custom-modal).
*/
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    // Array to store references to active settings modals
    private modals: any[] = [];

    // Add a new settings modal to the service
    add(modal: any) {
        this.modals.push(modal);
    }

    // Remove a settings modal from the service based on its ID
    remove(id: string) {
        this.modals = this.modals.filter(x => x.id !== id);
    }

    // Open a specific settings modal based on its ID
    open(id: string) {
        const modal = this.modals.find(x => x.id === id);
        modal.open();
    }

    // Close a specific settings modal based on its ID
    close(id: string) {
        const modal = this.modals.find(x => x.id === id);
        modal.close();
    }   
}