import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

/**
 * Service used for broadcasting audio time and resetting it.
 */
@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private variableSubject = new BehaviorSubject<number>(0);
  variable$ = this.variableSubject.asObservable();

  public audioResetRequested: Subject<boolean> = new Subject<boolean>();

  /**
   * Updates the current audio timestamp.
   */
  updateVariable(newValue: number) {
    this.variableSubject.next(newValue);
  }

  /**
   * Resets the current audio timestamp.
   */
  public resetAudioTime(): void {
    this.audioResetRequested.next(true);
  }
}
