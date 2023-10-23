import { Component, OnInit } from '@angular/core';
import { SpeechBubble, SpeechBubbleExport } from '../data/speechBubble.model';
import { WordExport } from '../data/wordToken.model';
import { SignalRService } from '../service/signalRService';
import {environment} from "../../environments/environment";

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
  speechBubbles: LinkedList = new LinkedList;

  timeSinceFocusOutList: Map<number, number> = new Map<number, number>();
  intervalList: ReturnType<typeof setInterval>[] = [];
 

  constructor(private signalRService: SignalRService) {}

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

    const speechBubble = this.getSpeechBubbleById(id);
    if (!speechBubble) return;
  
    clearInterval(this.intervalList[id]);
    this.timeSinceFocusOutCounter(id);
  }

  public getSpeechBubbleById(id: number): SpeechBubble | undefined {
    let current = this.speechBubbles.head;
  
    while (current) {
      if (current.id === id) {
        return current;
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
    const maxSecondsSinceFocusOut = 5;
    const intervalInMilliseconds = 1000;

    this.timeSinceFocusOutList.set(id, 0);
  
    this.intervalList[id] = setInterval(() => {
      const currentValue = this.timeSinceFocusOutList.get(id) || 0;
      this.timeSinceFocusOutList.set(id, currentValue + 1);
  
      if (currentValue >= maxSecondsSinceFocusOut) {
        clearInterval(this.intervalList[id]);
        this.callExportToJson(id);
        this.timeSinceFocusOutList.set(id, 0);
        return;
      }
    }, intervalInMilliseconds);
  }

  /**
  * Calls the exportToJson method to export a speech bubble with the specified id.
  * @param id - The id of the speech bubble to export.
  */
  public callExportToJson(id: number) {
    const speechBubbleToExport = this.getSpeechBubbleById(id);
    if(!speechBubbleToExport) return;
    speechBubbleToExport.removeEmptyWords(); 
    const currentExport = speechBubbleToExport.getExport();
    if(currentExport == undefined) return;
    this.exportToJson([currentExport]);
  }

  /**
  * Exports a speech bubble list to a JSON file and sends it to a specified API endpoint.
  * @param speechBubbleExportList - An array of SpeechBubbleExport objects representing the speech bubbles to be exported.
  */
  public exportToJson(speechBubbleExportList: SpeechBubbleExport[]) {

    const speechBubbleChain = new SpeechBubbleChain(speechBubbleExportList);
    const jsonData = speechBubbleChain.toJSON();

    fetch(environment.apiURL + '/api/speechbubble/update', {
      method: 'POST',
      body: JSON.stringify(jsonData),
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
        speechBubbles.push(current);
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

    let current = this.speechBubbles.head;

    while (current) {

      if(current.id == id) {
          this.speechBubbles.remove(current);
          return;
      }
      current = current.next;
    }  
  }
}

/**
* The SpeechBubbleChain class represents a chain of speech bubbles.
* It is used for exporting and importing speech bubbles in JSON format.
*/
export class SpeechBubbleChain {
  public SpeechbubbleChain: SpeechBubbleExport[];

  /**
   * Creates an instance of the SpeechBubbleChain class.
   * @param SpeechbubbleChain The array of speech bubbles in the chain.
   */
  constructor(SpeechbubbleChain: SpeechBubbleExport[]) {
    this.SpeechbubbleChain = SpeechbubbleChain;
  }

  /**
   * Converts the SpeechBubbleChain object to a JSON object.
   * @returns The JSON representation of the SpeechBubbleChain object.
   */
  toJSON() {
    return {
      SpeechbubbleChain: this.SpeechbubbleChain.map(speechBubble => speechBubble.toJSON())
    };
  }
}

/**
 * The LinkedList class represents a linked list data structure.
 * It provides methods to add and remove speech bubbles, as well as
 * retrieve information about the list.
 */
export class LinkedList {
    public head: SpeechBubble | null;
    public tail: SpeechBubble | null;
    public currentIndex: number;

    constructor() {
      this.head = null;
      this.tail = null;
      this.currentIndex = 0;
    }

    /**
    * Adds a speech bubble to the linked list.
    * Assigns a unique ID to the speech bubble and updates the head and tail pointers.
    * @param speechBubble - The speech bubble to be added.
    */
    add(speechBubble: SpeechBubble) {
      if (!this.head) {
        this.head = speechBubble;
        this.tail = speechBubble;
      } else {
        if (this.tail) {
          this.tail.next = speechBubble;
          speechBubble.prev = this.tail;
          this.tail = speechBubble;
        }
      }
    }

    /**
    * Removes a speech bubble from the linked list.
    * Updates the head and tail pointers and adjusts the next and previous references.
    * @param speechBubble - The speech bubble to be removed.
    */
    remove(speechBubble: SpeechBubble) {
      if (speechBubble === this.head) {
        this.head = speechBubble.next;
      }
      if (speechBubble === this.tail) {
        this.tail = speechBubble.prev;
      }
      if (speechBubble.prev) {
        speechBubble.prev.next = speechBubble.next;
      }
      if (speechBubble.next) {
        speechBubble.next.prev = speechBubble.prev;
      }
    }

    /**
    * Prints the word lists of all speech bubbles in the linked list.
    * Returns a string representation of the word lists.
    * @returns A string representing the word lists of the speech bubbles.
    */
    printWordLists() {
        let current = this.head;
        const speechBubbles = [];
        while (current) {
            speechBubbles.push(current.words);
            current = current.next;
        }
        return speechBubbles.join(" ");
    }

    /**
    * Returns a string representation of the linked list.
    * The string includes information about each speech bubble in the list.
    * @returns A string representing the linked list.
    */
    toString() {
      let current = this.head;
      const speechBubbles = [];
      while (current) {
        speechBubbles.push(current.toString());
        current = current.next;
      }
      return speechBubbles.join(" ");
    }

    /**
    * Returns the size of the linked list.
    * Counts the number of speech bubbles in the list and returns the count.
    * @returns The number of speech bubbles in the linked list.
    */
    size() {
      let current = this.head;
      let count = 0;
      while (current) {
        count++;
        current = current.next;
      }
      return count;
    }
}