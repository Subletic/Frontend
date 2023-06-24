import {Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {Subject} from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  public newBubbleReceived: Subject<string> = new Subject<string>();
  public receivedAudioStream: Subject<Int16Array> = new Subject<Int16Array>();

  constructor() {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiURL + '/communicationHub') // Specify the SignalR endpoint URL
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR connected.')
        this.initStreamConnection();
      })
      .catch(err => console.error('SignalR connection error: ', err));

    this.hubConnection.on("newBubble", (speechBubble) => {
      this.newBubbleReceived.next(speechBubble);
      console.log("Neue SpeechBubble erhalten:", speechBubble);
    });
  }

  private initStreamConnection(): void {
    this.hubConnection.stream("ReceiveAudioStream").subscribe({
      next: (data: Int16Array) => {
        this.receivedAudioStream.next(data);
        console.log(data);
      },
      complete: () => {
        console.log("Stream completed");
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
