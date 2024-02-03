import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { SpeechBubbleExport } from '../data/speechBubble/speechBubbleExport.model';
import { ConsoleHideService } from './consoleHide.service';
import { ToastrService } from 'ngx-toastr';

/**
 * Service used for listening to RPC calls from the backend.
 */
@Injectable({
  providedIn: 'root',
})
export class BackendListenerService {
  private hubConnection: signalR.HubConnection;
  public newBubbleReceived: Subject<SpeechBubbleExport[]> = new Subject<SpeechBubbleExport[]>();
  public oldBubbleDeleted: Subject<number> = new Subject<number>();
  public clearBubbles: Subject<void> = new Subject<void>();
  public receivedAudioStream: Subject<Int16Array> = new Subject<Int16Array>();

  /**
   * Initializes the SignalR connection and subscribes to the RPC calls.
   * @param consoleHideService ConsoleHideService
   * @param toastr ToastrService
   */
  constructor(
    private consoleHideService: ConsoleHideService,
    private toastr: ToastrService,
  ) {
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
      this.oldBubbleDeleted.next(id);
    });

    this.hubConnection.on('abortCorrection', (reason: string) => {
      this.abortCorrection(reason);
    });
  }

  /**
   * Subscribes to the audio stream.
   * Audio data is expected in a Int16Array format.
   */
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

  /**
   * Aborts the correction and reloads the page.
   * @param reason Reason for aborting the correction.
   */
  private abortCorrection(reason: string): void {
    this.consoleHideService.backendListenerLog('Correction aborted: ' + reason);
    this.toastr.error('Die Seite wird in kürze neu geladen.', '', {
      timeOut: 10000,
      extendedTimeOut: 10000,
    });
    this.toastr.error(reason, 'Korrektion abgebrochen', { timeOut: 10000, extendedTimeOut: 10000 });
    this.clearBubbles.next();
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }
}
