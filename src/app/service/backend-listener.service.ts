import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { SpeechBubbleExport } from '../data/speechBubble/speechBubbleExport.model';

@Injectable({
  providedIn: 'root',
})
export class backendListener {
  private hubConnection: signalR.HubConnection;
  public newBubbleReceived: Subject<SpeechBubbleExport[]> = new Subject<
    SpeechBubbleExport[]
  >();
  public oldBubbleDeleted: Subject<number> = new Subject<number>();

  public receivedAudioStream: Subject<Int16Array> = new Subject<Int16Array>();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.BACKEND_URL + '/communicationHub') // Specify the SignalR endpoint URL
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connected.');
        this.subscribeToAudioStream();
      })
      .catch((err) => console.error('SignalR connection error: ', err));

    this.hubConnection.on('newBubble', (speechBubble) => {
      this.newBubbleReceived.next(speechBubble);
    });

    this.hubConnection.on('deleteBubble', (id) => {
      this.oldBubbleDeleted.next(id);
    });
  }

  private subscribeToAudioStream(): void {
    this.hubConnection.stream('ReceiveAudioStream').subscribe({
      next: (data: Int16Array) => {
        this.receivedAudioStream.next(data);
      },
      complete: () => {
        console.log('Stream completed');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
