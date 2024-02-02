import { ChangeDetectorRef, Component, OnInit, HostListener } from '@angular/core';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';
import { dictionary } from 'src/app/data/dictionary/dictionary.model';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { ToastrService } from 'ngx-toastr';

/**
 * Components represents the dictionary-editor as a whole.
 */
@Component({
  selector: 'app-dictionary-editor',
  templateUrl: './dictionary-editor.component.html',
  styleUrls: ['./dictionary-editor.component.scss'],
})
export class DictionaryEditorComponent implements OnInit {
  dictionary: dictionary;
  latestChangesList: dictionary[];
  indexInLatestChangesList: number;
  hasPrev: boolean;
  hasNext: boolean;
  alphabeticBoolean: boolean;
  alphabeticCallsAtIndex: number[];
  wordcount: number;

  constructor(
    private configurationService: ConfigurationService,
    public cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {
    this.latestChangesList = [];
    this.dictionary = new dictionary({
      language: 'de',
      additional_vocab: [{ content: '', sounds_like: [''] }],
    });
    this.addToLatestChanges();
    this.indexInLatestChangesList = 0;

    this.alphabeticBoolean = true;
    this.hasPrev = false;
    this.hasNext = false;
    this.wordcount = 0;
    this.updateWordCount();
    this.alphabeticCallsAtIndex = [];
  }

  ngOnInit(): void {
    this.configurationService.dictionaryUpdated.subscribe((updatedDictionary: dictionary) => {
      this.dictionary = updatedDictionary;
      this.addToLatestChanges();
      this.updateWordCount();
    });

    this.configurationService.newDictionaryUploaded.subscribe((uploadedDictionary: dictionary) => {
      this.dictionary.mergeWithDictionary(uploadedDictionary);
      this.configurationService.updateDictionary(this.dictionary);
    });
  }

  /**
   * Updates the wordCount with the current value of the dictionary-additional_vocab length.
   * Throws a warning if the limit of 1000 words is reached.
   */
  updateWordCount(): void {
    this.wordcount = this.dictionary.transcription_config.additional_vocab.length;
    if (this.wordcount > 1000) {
      this.toastr.warning(
        'Achtung: Die maximale Anzahl von 1000 Wörtern wurde überschritten.',
        'Fehler',
      );
    }
  }

  /**
   * Adds the current state of the dictionary to the list of latest changes.
   * Limits the list to a maximum number of saved changes. In case this limit is reached,
   * resets the list and index.
   */
  addToLatestChanges(): void {
    // New Objects with values of dictionary (would be a pointer without this procedure)
    const dictionaryZustand = new dictionary({
      language: 'de',
      additional_vocab: [{ content: '', sounds_like: [''] }],
    });
    dictionaryZustand.transcription_config = JSON.parse(
      JSON.stringify(this.dictionary.transcription_config),
    );
    this.latestChangesList.push(dictionaryZustand);
    this.indexInLatestChangesList++;

    const SAVED_CHANGES_SIZE = 1000;
    if (this.latestChangesList.length > SAVED_CHANGES_SIZE) {
      this.latestChangesList = [];
      this.indexInLatestChangesList = -1;
      this.alphabeticCallsAtIndex = [];
    }

    this.updateHasPrevAndNext();
  }

  /**
   * Navigates to the previous change in the list of latest changes.
   * Updates the dictionary with the previous state and removes the corresponding entry from the list.
   * The index is decremented twice: 1) for the pop 2) for going to the previous change.
   */
  goToPreviousChange(): void {
    const DICTIONARY_NODE = this.latestChangesList[this.indexInLatestChangesList - 1];
    this.configurationService.updateDictionary(DICTIONARY_NODE);
    this.latestChangesList.pop();
    // remove effect of index++ from updateDictionary AND set to previous entry
    this.indexInLatestChangesList -= 2;
    console.log(this.indexInLatestChangesList);
    if (this.alphabeticCallsAtIndex.includes(this.indexInLatestChangesList + 1, 1)) {
      this.alphabeticBoolean = this.alphabeticBoolean ? false : true;
    }
    this.cdr.detectChanges();
    this.updateHasPrevAndNext();
  }

  /**
   * Navigates to the next change in the list of latest changes.
   * Updates the dictionary with the next state and removes the corresponding entry from the list.
   * The index is not decremented at all, because -1 for the pop, but +1 for going to the next change.
   */
  goToNextChange(): void {
    const DICTIONARY_NODE = this.latestChangesList[this.indexInLatestChangesList + 1];
    this.configurationService.updateDictionary(DICTIONARY_NODE);
    this.latestChangesList.pop();
    console.log(this.indexInLatestChangesList);
    if (this.alphabeticCallsAtIndex.includes(this.indexInLatestChangesList, 1)) {
      this.alphabeticBoolean = this.alphabeticBoolean ? false : true;
    }
    this.cdr.detectChanges();
    this.updateHasPrevAndNext();
  }

  /**
   * Updates the status of the previous and next buttons based on the current state in the list of latest changes.
   */
  private updateHasPrevAndNext(): void {
    this.hasPrev = this.indexInLatestChangesList > 0 && this.latestChangesList.length > 1;
    this.hasNext = this.latestChangesList.length - 1 > this.indexInLatestChangesList;
  }

  /**
   * Adds a new, blank row to the dictionary.
   */
  addRow(): void {
    this.dictionary.transcription_config.additional_vocab.push({
      content: '',
      sounds_like: [''],
    });
    this.configurationService.updateDictionary(this.dictionary);
  }

  /**
   * Deletes given row from the dictionary.
   *
   * @param row - Row to be deleted.
   */
  onDeleteRow(row: additional_vocab): void {
    const index = this.dictionary.transcription_config.additional_vocab.indexOf(row);
    if (index !== -1) {
      this.dictionary.transcription_config.additional_vocab.splice(index, 1);
    }
    this.configurationService.updateDictionary(this.dictionary);
  }

  /**
   * Reacts to emitted 'changed row' and therefore updates dictionary service
   */
  onChangedRow(): void {
    this.configurationService.updateDictionary(this.dictionary);
  }

  /**
   * Makes call to let the dictionary be sorted alphabetically or
   * reverse alphabetically, depending on its current state.
   */
  sortAlphabeticallyCall(): void {
    if (this.alphabeticBoolean) {
      this.dictionary.sortAlphabetically();
      this.alphabeticBoolean = false;
    } else {
      this.dictionary.sortReverseAlphabetically();
      this.alphabeticBoolean = true;
    }
    this.configurationService.updateDictionary(this.dictionary);
    console.log(this.latestChangesList.length);
    this.alphabeticCallsAtIndex.push(this.latestChangesList.length - 1);
    console.log(this.alphabeticCallsAtIndex);
  }

  /**
   * Opens window for further explanation of the purpose of the dictionary.
   * Intended for users that do not yet know the function of the dictionary-process.
   */
  callHelp(): void {
    // Should call help window later
    console.log('Help is called!');
  }

  /**
   * Clears dictionary of all entries and sets it back to the original state with one empty row.
   */
  clearDictionary(): void {
    const EMPTY_DICTIONARY = new dictionary({
      language: 'de',
      additional_vocab: [{ content: '', sounds_like: [''] }],
    });

    this.dictionary = EMPTY_DICTIONARY;
    this.configurationService.updateDictionary(EMPTY_DICTIONARY);
    this.cdr.detectChanges();
  }

  /**
   * Shortcuts for going back and forth in the latestChangesList.
   *
   * @param event - Any key event triggered by user.
   */
  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey) {
      switch (event.key) {
        case 'z':
          this.goToPreviousChange();
          break;
        case 'y':
          this.goToNextChange();
          break;
      }
    }
  }
}
