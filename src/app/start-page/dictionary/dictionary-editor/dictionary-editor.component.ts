import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';
import { dictionary } from 'src/app/data/dictionary/dictionary.model';
import { LinkedList } from 'src/app/data/linkedList/linkedList.model';
import { ConfigurationService } from 'src/app/service/configuration.service';

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
  alphabeticBoolean: boolean;
  latestChangesList: LinkedList<dictionary> = new LinkedList<dictionary>();
  hasPrev: boolean;
  hasNext: boolean;

  constructor(
    private configurationService: ConfigurationService,
    public cdr: ChangeDetectorRef,
  ) {
    this.dictionary = new dictionary({
      language: 'de',
      additional_vocab: [{ content: '', sounds_like: [''] }],
    });
    this.addToLatestChanges();

    this.alphabeticBoolean = true;
    this.hasPrev = false;
    this.hasNext = false;
  }

  ngOnInit(): void {
    this.configurationService.dictionaryUpdated.subscribe(
      (updatedDictionary: dictionary) => {
        this.dictionary = updatedDictionary;
        this.addToLatestChanges();
      },
    );

    this.configurationService.newDictionaryUploaded.subscribe(
      (uploadedDictionary: dictionary) => {
        this.dictionary.mergeWithDictionary(uploadedDictionary);
        this.addToLatestChanges();
      },
    );
  }

  /**
   * Adds the current state of the dictionary to the list of latest changes.
   * Limits the list to a maximum number of saved changes.
   */
  private addToLatestChanges(): void {
    //New Objects with values of dictionary (would be a pointer without this procedure)
    const dictionaryZustand = new dictionary({
      language: 'de',
      additional_vocab: [{ content: '', sounds_like: [''] }],
    });
    dictionaryZustand.transcription_config = JSON.parse(
      JSON.stringify(this.dictionary.transcription_config),
    );
    this.latestChangesList.add(dictionaryZustand);

    const SAVED_CHANGES_SIZE = 50;
    if (this.latestChangesList.size() > SAVED_CHANGES_SIZE) {
      if (!this.latestChangesList.head) return;
      this.latestChangesList.remove(this.latestChangesList.head.data);
    }

    this.updateHasPrevAndNext();
  }

  /**
   * Navigates to the previous change in the list of latest changes.
   * Updates the dictionary with the previous state and removes the corresponding entry from the list.
   */
  goToPreviousChange(): void {
    const DICTIONARY_NODE = this.latestChangesList.getNodeByData(
      this.dictionary,
    );
    if (!(DICTIONARY_NODE && DICTIONARY_NODE.prev)) return;

    this.configurationService.updateDictionary(DICTIONARY_NODE.prev.data);
    if (!this.latestChangesList.tail) return;
    this.latestChangesList.remove(this.latestChangesList.tail.data);
    this.cdr.detectChanges();

    this.updateHasPrevAndNext();
  }

  /**
   * Navigates to the next change in the list of latest changes.
   * Updates the dictionary with the next state and removes the corresponding entry from the list.
   */
  goToNextChange(): void {
    const DICTIONARY_NODE = this.latestChangesList.getNodeByData(
      this.dictionary,
    );
    if (!(DICTIONARY_NODE && DICTIONARY_NODE.next)) return;

    this.configurationService.updateDictionary(DICTIONARY_NODE.next.data);
    if (!this.latestChangesList.tail) return;
    this.latestChangesList.remove(this.latestChangesList.tail.data);
    this.cdr.detectChanges();

    this.updateHasPrevAndNext();
  }

  /**
   * Updates the status of the previous and next buttons based on the current state in the list of latest changes.
   */
  private updateHasPrevAndNext(): void {
    const DICTIONARY_NODE = this.latestChangesList.getNodeByData(
      this.dictionary,
    );
    this.hasPrev = !!(DICTIONARY_NODE && DICTIONARY_NODE.prev);
    this.hasNext = !!(DICTIONARY_NODE && DICTIONARY_NODE.next);
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
    //this.addToLatestChanges(this.dictionary);
  }

  /**
   * Deletes given row from the dictionary.
   *
   * @param row - Row to be deleted.
   */
  onDeleteRow(row: additional_vocab): void {
    const index =
      this.dictionary.transcription_config.additional_vocab.indexOf(row);
    if (index !== -1) {
      this.dictionary.transcription_config.additional_vocab.splice(index, 1);
    }
    this.configurationService.updateDictionary(this.dictionary);
    //this.addToLatestChanges(this.dictionary);
  }

  /**
   * Reacts to emitted 'changed row' and therefore updates dictionary service
   */
  onChangedRow(): void {
    this.configurationService.updateDictionary(this.dictionary);
    //this.addToLatestChanges(this.dictionary);
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
    //this.addToLatestChanges(this.dictionary);
  }

  /**
   * Opens window for further explanation of the purpose of the dictionary.
   * Intended for users that do not yet know the function of the dictionary-process.
   */
  callHelp(): void {
    //Should call help window later
    console.log('Help is called!');
  }
}
