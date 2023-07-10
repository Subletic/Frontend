import {Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {Subject} from 'rxjs';
import {environment} from "../../environments/environment";
import { SpeechBubbleExport } from '../data/speechBubble.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  public newBubbleReceived: Subject<SpeechBubbleExport[]> = new Subject<SpeechBubbleExport[]>();
  public oldBubbledeleted: Subject<number> = new Subject<number>();
  
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

    this.hubConnection.on("deleteBubble", (id) => {
      this.oldBubbledeleted.next(id);
      console.log("Alte SpeechBubble gelöscht:", id);
    });
  }

  private initStreamConnection(): void {
    this.hubConnection.stream("ReceiveAudioStream").subscribe({
      next: (data: Int16Array) => {
        this.receivedAudioStream.next(data);
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
