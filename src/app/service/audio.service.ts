import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private variableSubject = new BehaviorSubject<number>(0);
  variable$ = this.variableSubject.asObservable();

  updateVariable(newValue: number) {
    this.variableSubject.next(newValue);
  }
}
