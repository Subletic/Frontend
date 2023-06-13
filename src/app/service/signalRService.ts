import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  public newBubbleReceived: Subject<string> = new Subject<string>();

  constructor() {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5003/communicationHub') // Specify the SignalR endpoint URL
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connected.'))
      .catch(err => console.error('SignalR connection error: ', err));

    this.hubConnection.on("newBubble", (speechBubble) => {
      this.newBubbleReceived.next(speechBubble);
      console.log("Neue SpeechBubble erhalten:", speechBubble);
    });
  }
}
