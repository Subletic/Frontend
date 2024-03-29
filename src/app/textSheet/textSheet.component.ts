import { Component, OnInit, ViewChild } from '@angular/core';
import { SpeechBubble } from '../data/speechBubble/speechBubble.model';
import { SpeechBubbleExport } from '../data/speechBubble/speechBubbleExport.model';
import { LinkedList } from '../data/linkedList/linkedList.model';
import { WordExport } from '../data/wordToken/wordExport.model';
import { SpeechBubbleChain } from '../data/speechBubbleChain/speechBubbleChain.module';
import { AudioService } from '../service/audio.service';
import { BackendProviderService } from '../service/backend-provider.service';
import { HotkeyMenueComponent } from '../hotkey-menue/hotkey-menue.component';
import { BackendListenerService } from '../service/backend-listener.service';

/**
 * The TextSheetComponent represents a component that handles the speech bubbles in a text sheet.
 * It provides methods to add, delete and manipulate speech bubbles, as well as retrieve information about the speech bubbles.
 */
@Component({
  selector: 'app-text-sheet',
  templateUrl: './textSheet.component.html',
  styleUrls: ['./textSheet.component.scss'],
})
export class TextSheetComponent implements OnInit {
  // Attribute holding all showcased linkedList of Instance SpeechBubble
  public speechBubbles: LinkedList<SpeechBubble> = new LinkedList<SpeechBubble>();
  public timeSinceFocusOutList: Map<number, number> = new Map<number, number>();
  public intervalList: ReturnType<typeof setInterval>[] = [];

  private readTimeInSeconds = 0;

  @ViewChild(HotkeyMenueComponent, { static: true }) hotkeyMenueComponent!: HotkeyMenueComponent;
  // Boolean variable to track whether any of the burger menu buttons is pressed
  isButtonPressed = false;

  constructor(
    private backendListenerService: BackendListenerService,
    private backendProviderService: BackendProviderService,
    private audioService: AudioService,
  ) {
    this.audioService.variable$.subscribe((value) => {
      this.readTimeInSeconds = value / 1000;
    });
  }

  ngOnInit(): void {
    this.backendListenerService.newBubbleReceived.subscribe((SpeechBubbleExportList) => {
      this.importfromJson(SpeechBubbleExportList);
    });

    this.backendListenerService.oldBubbleDeleted.subscribe((id) => {
      this.deleteSpeechBubble(id);
    });

    this.backendListenerService.clearBubbles.subscribe(() => {
      this.speechBubbles = new LinkedList<SpeechBubble>();
    });

    this.simulateAudioTime();

    this.hotkeyMenueComponent.buttonStateChanged.subscribe((newState: boolean) => {
      this.isButtonPressed = newState;

      if (this.isButtonPressed) {
        this.addIsButtonPressedClass();
      } else {
        this.removeIsButtonPressedClass();
      }
    });
  }

  /**
   * Adds the 'isButtonPressed' class to the middle container.
   */
  private addIsButtonPressedClass(): void {
    const middleContainer = document.querySelector('.middle-container');
    middleContainer?.classList.add('isButtonPressed');
  }

  /**
   * Removes the 'isButtonPressed' class from the middle container.
   */
  private removeIsButtonPressedClass(): void {
    const middleContainer = document.querySelector('.middle-container');
    middleContainer?.classList.remove('isButtonPressed');
  }

  /**
   * Imports data from a JSON string and converts it into an array of SpeechBubbleExport objects.
   * @returns An array of SpeechBubbleExport objects.
   * @param speechBubbleChain - The imported SpeechBubble Chain.
   */
  public importfromJson(speechBubbleChain: SpeechBubbleExport[]): void {
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
          word.speaker,
        );

        speechBubbleContent.push(wordExport);
      });

      const speechBubbleExport2 = new SpeechBubbleExport(
        speechBubbleExport.id,
        speechBubbleExport.speaker,
        speechBubbleExport.startTime,
        speechBubbleExport.endTime,
        speechBubbleContent,
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
   * @param id - The id of the textbox.
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
  public timeSinceFocusOutCounter(id: number): void {
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
  public callExportToJson(id: number): void {
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
    const SPEECH_BUBBLE_CHAIN = new SpeechBubbleChain(speechBubbleExportList);
    this.backendProviderService.updateSpeechBubbles(SPEECH_BUBBLE_CHAIN);
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
  public deleteSpeechBubble(id: number): void {
    let current = this.speechBubbles.head;

    while (current) {
      if (current.data.id == id) {
        this.speechBubbles.remove(current.data);
        this.checkForTranscriptionEnd();
        return;
      }
      current = current.next;
    }
  }

  /**
   * Checks if the transcription has ended and resets the audio time if so.
   */
  private checkForTranscriptionEnd(): void {
    if (this.speechBubbles.head != null) {
      return;
    }

    this.audioService.resetAudioTime();
  }

  /**
   * Simulates the Audio Time (until it is imported from circular Buffer)
   */
  public simulateAudioTime(): void {
    const INTERVAL_IN_MILLISECONDS = 100;

    setInterval(() => {
      this.fontWeightForSpeechBubblesAt(this.readTimeInSeconds);
    }, INTERVAL_IN_MILLISECONDS);
  }

  /**
   * Finds SpeechBubbles that match the given audioTime and call adjustWordsFontWeight for their word list.
   *
   * @param audioTime - the current Audio Time
   */
  public fontWeightForSpeechBubblesAt(audioTime: number): void {
    let current = this.speechBubbles.head;

    while (current) {
      if (this.currentAudioTimeInSpeechbubbleTime(current.data, audioTime)) {
        current.data.adjustWordsFontWeight(audioTime);
        // to prevent currentWord being stuck
        current.prev?.data.adjustWordsFontWeight(audioTime);
        current.next?.data.adjustWordsFontWeight(audioTime);
      }
      current = current.next;
    }
  }

  /**
   * Checks if given audioTime and SpeechBubble time slot match.
   *
   * @param SpeechBubble - The SpeechBubble to compare with.
   * @param audioTime - Time stamp to compare own time slot with.
   */
  private currentAudioTimeInSpeechbubbleTime(
    SpeechBubble: SpeechBubble,
    audioTime: number,
  ): boolean {
    return SpeechBubble.begin <= audioTime && SpeechBubble.end >= audioTime;
  }
}
