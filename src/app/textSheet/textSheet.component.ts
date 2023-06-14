import { Component, OnInit } from '@angular/core';
import { SpeechBubble, SpeechBubbleExport } from '../data/speechBubble.model';
import { WordToken, WordExport } from '../data/wordToken.model';
import { SignalRService } from '../service/signalRService';

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
        speechBubble.id = this.currentIndex;
      this.currentIndex++;
  
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

    //Attributes holding all showcased linkedList of Instance SpeechBubble
    speechBubbles: LinkedList = new LinkedList;

    constructor(private signalRService: SignalRService) {}

    ngOnInit() {

      //On receiving a new Speech Bubble from Backend, this function calls the importfromJSON 
      //function for all speech Bubbles in the list
      this.signalRService.newBubbleReceived.subscribe(speechBubble => {
        console.log("Neue SpeechBubble erhalten:", speechBubble);
        this.importfromJSON(speechBubble);
      });

      const testBubble1 = new SpeechBubble(0, 0, 0);
      this.speechBubbles.add(testBubble1);

      const word = new WordToken('Testeingabe', 0.2, 1, 1, 1);
      const word2 = new WordToken('aus', 0.9, 1, 1, 1);
      const word3 = new WordToken('OnInit', 0.7, 1, 1, 1);

      testBubble1.words.add(word);
      testBubble1.words.add(word2);
      testBubble1.words.add(word3);
    }

    /**
    * Exports a speech bubble list to a JSON file and sends it to a specified API endpoint.
    * @param speechBubbleExportList - An array of SpeechBubbleExport objects representing the speech bubbles to be exported.
    */
    exportToJson(speechBubbleExportList: SpeechBubbleExport[]) {

      const speechBubbleChain = new SpeechBubbleChain(speechBubbleExportList);
      const jsonData = speechBubbleChain.toJSON();

      fetch('http://localhost:5003/api/speechbubble/update', {
        method: 'POST',
        body: JSON.stringify(jsonData ),
        headers: {
         'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            console.log('Neue SpeechBubble wurde erfolgreich gesendet');
          } else {
            console.error('Fehler beim Senden der neuen SpeechBubble');
          }
        })
        .catch(error => {
          console.error('Fehler beim Senden der neuen SpeechBubble:', error);
        });
    }

    /**
    * Calls the exportToJson method to export a speech bubble at the specified index.
    * @param index - The index of the speech bubble to export.
    */
    callExportToJson(index: number) {
      let current = this.speechBubbles.tail;
      for(let i = 0; i < index; i++) {
        if (current == null) return;
        current = current.prev;
      }
      const currentExport = current?.getExport();

      if(currentExport == undefined) return;
      this.exportToJson([currentExport]);
    }

    /**
    * Imports data from a JSON string and converts it into an array of SpeechBubbleExport objects.
    * @param jsonString The JSON string to import.
    * @returns An array of SpeechBubbleExport objects.
    */
    importfromJSON(speechBubbleChain: any){
     
      const speechBubbleExportArray: SpeechBubbleExport[] = [];
      
      speechBubbleChain.forEach((speechBubbleData: any) => {
        const speechBubbleContent: WordExport[] = [];

        speechBubbleData.speechBubbleContent.forEach((word: any) => {
            const wordExport = new WordExport(
              word.word,
              word.confidence,
              word.startTime,
              word.endTime,
              word.speaker
            )
      
            speechBubbleContent.push(wordExport);
        });

        const speechBubbleExport = new SpeechBubbleExport(
          speechBubbleData.id,
          speechBubbleData.speaker,
          speechBubbleData.startTime,
          speechBubbleData.endTime,
          speechBubbleContent
        );

        speechBubbleExportArray.push(speechBubbleExport);
      });

      speechBubbleExportArray.forEach (element => {
        this.speechBubbles.add(element.toSpeechBubble());
      });

      this.exportToJson(speechBubbleExportArray);
    }

    //Attributes for timeCounters, should maybe be refactored elsewhere
    timeSinceFocusOutList: number[] = [];
    intervalList: ReturnType<typeof setInterval>[] = [];

    /**
    * Keeps track of the time since the last focusout event for each textbox.
    * Starts a timer for the specified index and performs the corresponding logic
    * if the inactivity exceeds 5 seconds.
    * @param index - The index of the textbox.
    */
    timeSinceFocusOutCounter(index: number) {

      this.timeSinceFocusOutList[index] = 0;
      console.log("huh " + index);

      this.intervalList[index] = setInterval(() => {
        this.timeSinceFocusOutList[index]++; // Zähle die Zeit seit dem letzten focusout-Ereignis
        if (this.timeSinceFocusOutList[index] >= 5) {
          // Führe hier die entsprechende Logik für eine Inaktivität von mehr als 5 Sekunden aus
          console.log("timeSinceFocusOut > 5 bei index " + index);
          clearInterval(this.intervalList[index]);
          this.callExportToJson(index);
          
       
          this.timeSinceFocusOutList[index] = 0;
          return;
        } 
      }, 1000);
    }

    /**
    * Handles the focusout event for the textbox.
    * Stops the timer for the specified index to prevent duplicate execution,
    * and starts the timer again for the specified index.
    * @param event - The focusout event object.
    * @param index - The index of the textbox.
    */
    onFocusOut(index: number) {

      if(this.timeSinceFocusOutList[index] >= 5) {
        console.log("TimeSinceFocusOut > 5");
      }

      clearInterval(this.intervalList[index]);
      this.timeSinceFocusOutCounter(index);
    }
 
    /**
    * Retrieves an array of all speech bubbles in the speechBubbles list.
    * @returns An array of speech bubbles.
    */
    getSpeechBubblesArray(): SpeechBubble[] {
        let current = this.speechBubbles.head;
        const speechBubbles: SpeechBubble[] = [];
        while (current) {
          speechBubbles.push(current);
          current = current.next;
        }
        return speechBubbles;
      }

    /**
    * Adds a new standard speech bubble to the speechBubbles list.
    * The new speech bubble is then added to the list and its representation is logged to the console.
    */
    addNewStandardSpeechBubble() {
      const testBubble1 = new SpeechBubble(0, 0, 0);

      this.speechBubbles.add(testBubble1);

      const speechBubbleArray = this.getSpeechBubblesArray();

      for(let i = 0; i < speechBubbleArray.length; i++) {
        console.log(speechBubbleArray[i].id + speechBubbleArray[i].words.toString());

      }
    }
    
    /**
    * Deletes the oldest speech bubble from the speechBubbles list.
    * The head speech bubble is removed from the list.
    */
    deleteOldestSpeechBubble() {

        if(this.speechBubbles.head){
            this.speechBubbles.remove(this.speechBubbles.head);
        }
    }

    /**
    * Sends a request to the server to send a new speech bubble.
    * This method makes a POST request to the specified API endpoint.
    */
    sendNewSpeechBubble() {
      fetch('http://localhost:5003/api/speechbubble/send-new-bubble', {
        method: 'POST',
      })
        .then(response => {
          if (response.ok) {
            console.log('Neue SpeechBubble wurde erfolgreich gesendet');
          } else {
            console.error('Fehler beim Senden der neuen SpeechBubble');
          }
        })
        .catch(error => {
          console.error('Fehler beim Senden der neuen SpeechBubble:', error);
        });
    }

}
