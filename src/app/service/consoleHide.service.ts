import { Injectable } from "@angular/core";
import { WordToken } from "../data/wordToken/wordToken.model";


@Injectable({ 
    providedIn: 'root' 
}) 
export class ConsoleHideService { 
    /**
     * all properties show the current boolean state for the logs of the different components or services
     * true means the logs are shown in the console and false means they are hidden
     * false is also the default state, so for every commit or merge all states SHOULD be in default state
     */
    private hidLogEnabled = false;

    private backendProviderLogEnabled = false;

    private backendListenerLogEnabled = false;

    private audioLogEnabled = false;

    private speechbubbleLogEnabled = false;


  hidLog(message: string) {
    if (this.hidLogEnabled == true) {
      console.log(message);
    }
  }
  
  hidData(data: HIDDevice[]) {
    if (this.hidLogEnabled == true) {
      console.log(data);
    }
  }

  backendProviderLog(message: string) {
    if (this.backendProviderLogEnabled == true) {
      console.log(message);
    }
  }

  backendListenerLog(message: string) {
    if (this.backendListenerLogEnabled == true) {
      console.log(message);
    }
  }

  audioLog(message: string) {
    if (this.audioLogEnabled == true) {
      console.log(message);
    }
  }

  speechbubbleLog(message: string) {
    if (this.speechbubbleLogEnabled == true) {
      console.log(message);
    }
  }
}