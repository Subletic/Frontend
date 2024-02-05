import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Config } from '../data/config/config.model';
import { SpeechBubbleChain } from '../data/speechBubbleChain/speechBubbleChain.module';
import { ConsoleHideService } from './consoleHide.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class BackendProviderService {
  constructor(
    private consoleHideService: ConsoleHideService,
    private toastr: ToastrService,
  ) {}

  /**
   * Uploads the user configuration to the backend.
   * @param config User config including dictionary and delay length.
   */
  public uploadConfiguration(config: Config): void {
    fetch(environment.BACKEND_URL + '/api/Configuration/upload', {
      method: 'POST',
      body: JSON.stringify(config),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      if (response.ok) {
        this.consoleHideService.backendProviderLog(
          'Einstellungen wurden an Backend gesendet'
        );
        return;
      } else {
        throw await response.text();
      }
    }).catch((error) => {
      console.error('Error while uploading configuration to backend: ', error);
      this.toastr.error('Einstellungen konnten nicht gesendet werden: ' + error, '', {
        timeOut: 10000,
        extendedTimeOut: 10000,
      });
    });
  }

  /**
   * Uploads changed speech bubbles to the backend.
   * @param speechBubbleChain Speech bubble chain containing updated speech bubbles
   */
  public updateSpeechBubbles(speechBubbleChain: SpeechBubbleChain): void {
    fetch(environment.BACKEND_URL + '/api/speechbubble/update', {
      method: 'POST',
      body: JSON.stringify(speechBubbleChain),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          this.consoleHideService.backendProviderLog(
            'Aktualisierte SpeechBubble wurde erfolgreich gesendet',
          );
        } else {
          console.error('Fehler beim Senden der aktualisierten SpeechBubble');
        }
      })
      .catch((error) => {
        console.error('Fehler beim Senden der aktualisierten SpeechBubble:', error);
      });
  }

  /**
   * Calls the backend to restart.
   * @param timeBeforeReload Time before frontend reloads in ms.
   */
  public callBackendReload(timeBeforeReload: number): void {
    fetch(environment.BACKEND_URL + '/api/restart', {
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          this.consoleHideService.backendProviderLog('Called for restart');
          setTimeout(() => {
            window.location.reload();
          }, timeBeforeReload);
        } else {
          console.error('Error with calling restart');
        }
      })
      .catch((error) => {
        console.error('Error with calling restart:', error);
      });
  }
}
