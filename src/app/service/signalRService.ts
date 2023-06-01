import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  public receivedMessage: Subject<string> = new Subject<string>();

  constructor() {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5003/communicationHub') // Specify the SignalR endpoint URL
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connected.'))
      .catch(err => console.error('SignalR connection error: ', err));

    this.hubConnection.on('ReceiveMessage', (message: string) => {
      this.receivedMessage.next(message); // Notify subscribers about received messages
      console.log("angekommen");
    });
  }
}
