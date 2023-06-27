import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import {environment} from "../../environments/environment";
import { LinkedList } from '../data/linkedList.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  public newBubbleReceived: Subject<string> = new Subject<string>();
  public oldBubbledeleted: Subject<number> = new Subject<number>();

  constructor() {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiURL + '/communicationHub') // Specify the SignalR endpoint URL
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connected.'))
      .catch(err => console.error('SignalR connection error: ', err));

    this.hubConnection.on("newBubble", (speechBubble) => {
      this.newBubbleReceived.next(speechBubble);
      console.log("Neue SpeechBubble erhalten:", speechBubble);
    });

    this.hubConnection.on("deleteBubble", (id) => {
      this.oldBubbledeleted.next(id);
      console.log("Alte SpeechBubble gelöscht:", id);
    });
  }
}
