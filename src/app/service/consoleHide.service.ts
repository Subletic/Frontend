import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({ 
    providedIn: 'root' 
}) 
export class ConsoleHideService { 
    constructor() {}
    
    disableConsoleHid(): void { 
        if (!environment.production == true) {
            console.log = function (): void { };
        }
    }

    disableConsoleSignalR(): void { 
        if (!environment.production == false) {
            console.log = function (): void { };
        }
    }

    disableConsoleTextSheet(): void { 
        if (!environment.production == true) {
            console.log = function (): void { };
        }
    }
}