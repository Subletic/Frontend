import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { SpeechBubbleExport } from '../data/speechBubble/speechBubbleExport.model';
import { ConsoleHideService } from './consoleHide.service';

@Injectable({
  providedIn: 'root',
})
export class backendListener {
  private hubConnection: signalR.HubConnection;
  public newBubbleReceived: Subject<SpeechBubbleExport[]> = new Subject<SpeechBubbleExport[]>();
  public oldBubbledeleted: Subject<number> = new Subject<number>();

  public receivedAudioStream: Subject<Int16Array> = new Subject<Int16Array>();

  constructor(private consoleHideService: ConsoleHideService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.BACKEND_URL + '/communicationHub') // Specify the SignalR endpoint URL
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.consoleHideService.backendListenerLog('SignalR connected.');
        this.subscribeToAudioStream();
      })
      .catch((err) => console.error('SignalR connection error: ', err));

    this.hubConnection.on('newBubble', (speechBubble) => {
      this.newBubbleReceived.next(speechBubble);
    });

    this.hubConnection.on('deleteBubble', (id) => {
      this.oldBubbledeleted.next(id);
    });

  }

  private subscribeToAudioStream(): void {
    this.hubConnection.stream('ReceiveAudioStream').subscribe({
      next: (data: Int16Array) => {
        this.receivedAudioStream.next(data);
      },
      complete: () => {
        this.consoleHideService.backendListenerLog('Stream completed');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
