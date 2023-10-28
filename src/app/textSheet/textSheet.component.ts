import { Component, OnInit } from '@angular/core';
import { SpeechBubble } from '../data/speechBubble/speechBubble.model';
import { SpeechBubbleExport } from '../data/speechBubble/speechBubbleExport.model';
import { LinkedList } from '../data/linkedList/linkedList.model';
import { WordExport } from '../data/wordToken/wordExport.model';
import { SignalRService } from '../service/signalRService';
import { environment } from "../../environments/environment";
import { SpeechBubbleChain } from '../data/speechBubbleChain.module';

/**
 * The TextSheetComponent represents a component that handles the speech bubbles in a text sheet.
 * It provides methods to add, delete and manipulate speech bubbles, as well as retrieve information about the speech bubbles.
 */
@Component({
  selector: 'app-text-sheet',
  templateUrl: './textSheet.component.html',
  styleUrls: ['./textSheet.component.scss']
})
export class TextSheetComponent implements OnInit {

  //Attribute holding all showcased linkedList of Instance SpeechBubble
  speechBubbles: LinkedList<SpeechBubble> = new LinkedList<SpeechBubble>;

  timeSinceFocusOutList: Map<number, number> = new Map<number, number>();
  intervalList: ReturnType<typeof setInterval>[] = [];



  constructor(private signalRService: SignalRService) { }

  ngOnInit() {

    this.signalRService.newBubbleReceived.subscribe(SpeechBubbleExportList => {
      this.importfromJSON(SpeechBubbleExportList);
    });

    this.signalRService.oldBubbledeleted.subscribe(id => {
      this.deleteSpeechBubble(id);
    });

  }

  /**
  * Imports data from a JSON string and converts it into an array of SpeechBubbleExport objects.
  * @param jsonString The JSON string to import.
  * @returns An array of SpeechBubbleExport objects.
  */
  public importfromJSON(speechBubbleChain: SpeechBubbleExport[]) {
    if (!speechBubbleChain || speechBubbleChain.length === 0) {
      console.error('Invalid speechBubbleChain object.');
      return;
    }

    const speechBubbleExportArray: SpeechBubbleExport[] = [];

    speechBubbleChain.forEach((speechBubbleExport: SpeechBubbleExport) => {
      const speechBubbleContent: WordExport[] = [];

      speechBubbleExport.speechBubbleContent.forEach((word: WordExport) => {
        const wordExport = new WordExport(
          word.word,
          word.confidence,
          word.startTime,
          word.endTime,
          word.speaker
        );

        speechBubbleContent.push(wordExport);
      });

      const speechBubbleExport2 = new SpeechBubbleExport(
        speechBubbleExport.id,
        speechBubbleExport.speaker,
        speechBubbleExport.startTime,
        speechBubbleExport.endTime,
        speechBubbleContent
      );

      speechBubbleExportArray.push(speechBubbleExport2);
    });

    speechBubbleExportArray.forEach((element: SpeechBubbleExport) => {
      const speechBubble = element.toSpeechBubble();
      if (speechBubble) {
        this.speechBubbles.add(speechBubble);
      }
    });
  }

  /**
  * Handles the focusout event for the textbox.
  * Stops the timer for the specified index to prevent duplicate execution,
  * and starts the timer again for the specified index.
  * @param event - The focusout event object.
  * @param index - The index of the textbox.
  */
  public onFocusOut(id: number) {

    const SPEECHBUBBLE = this.getSpeechBubbleById(id);
    if (!SPEECHBUBBLE) return;

    clearInterval(this.intervalList[id]);
    this.timeSinceFocusOutCounter(id);
  }

  public getSpeechBubbleById(id: number): SpeechBubble | undefined {

    let current = this.speechBubbles.head;

    while (current) {
      if (current.data.id === id) {
        return current.data;
      }
      current = current.next;
    }
    return undefined;
  }

  /**
  * Keeps track of the time since the last focusout event for each textbox.
  * Starts a timer for the specified speechbubble and performs the corresponding logic
  * if the inactivity exceeds 5 seconds.
  * @param id - The id of the speechbubble to set a counter for
  */
  public timeSinceFocusOutCounter(id: number) {
    const MAX_SECONDS_SINCE_FOCUS_OUT = 5;
    const INTERVAL_IN_MILLISECONDS = 1000;

    this.timeSinceFocusOutList.set(id, 0);

    this.intervalList[id] = setInterval(() => {
      const SECONDS_SINCE_FOCUS_OUT = this.timeSinceFocusOutList.get(id) || 0;
      this.timeSinceFocusOutList.set(id, SECONDS_SINCE_FOCUS_OUT + 1);

      if (SECONDS_SINCE_FOCUS_OUT >= MAX_SECONDS_SINCE_FOCUS_OUT) {
        clearInterval(this.intervalList[id]);
        this.callExportToJson(id);
        this.timeSinceFocusOutList.set(id, 0);
        return;
      }
    }, INTERVAL_IN_MILLISECONDS);
  }

  /**
  * Calls the exportToJson method to export a speech bubble with the specified id.
  * @param id - The id of the speech bubble to export.
  */
  public callExportToJson(id: number) {
    const speechBubbleToExport = this.getSpeechBubbleById(id);
    if (!speechBubbleToExport) return;
    speechBubbleToExport.removeEmptyWords();
    const CURRENT_EXPORT = speechBubbleToExport.getExport();
    if (CURRENT_EXPORT == undefined) return;
    this.exportToJson([CURRENT_EXPORT]);
  }

  /**
  * Exports a speech bubble list to a JSON file and sends it to a specified API endpoint.
  * @param speechBubbleExportList - An array of SpeechBubbleExport objects representing the speech bubbles to be exported.
  */
  public exportToJson(speechBubbleExportList: SpeechBubbleExport[]): void {

    const SPEECHBUBBLE_CHAIN = new SpeechBubbleChain(speechBubbleExportList);
    const JSON_DATA = SPEECHBUBBLE_CHAIN.toJSON();

    fetch(environment.apiURL + '/api/speechbubble/update', {
      method: 'POST',
      body: JSON.stringify(JSON_DATA),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          console.log('Aktualisierte SpeechBubble wurde erfolgreich gesendet');
        } else {
          console.error('Fehler beim Senden der aktualisierten SpeechBubble');
        }
      })
      .catch(error => {
        console.error('Fehler beim Senden der aktualisierten SpeechBubble:', error);
      });
  }

  /**
  * Retrieves an array of all speech bubbles in the speechBubbles list.
  * @returns An array of speech bubbles.
  */
  public getSpeechBubblesArray(): SpeechBubble[] {
    let current = this.speechBubbles.head;
    const speechBubbles: SpeechBubble[] = [];
    while (current) {
      speechBubbles.push(current.data);
      current = current.next;
    }
    return speechBubbles;
  }

  /**
  * Deletes a speech bubble from the speechBubbles list based on the id.
  * The speech bubble is removed from the list.
  * 
  * @param id - The id of the speechbubble to be removed.
  */
  public deleteSpeechBubble(id: number) {

    //if (!this.speechBubbles.head) return;
    let current = this.speechBubbles.head;

    while (current) {

      if (current.data.id == id) {
        this.speechBubbles.remove(current.data);
        return;
      }
      current = current.next;
    }
  }
}