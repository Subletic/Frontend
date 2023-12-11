import { Component, OnInit } from '@angular/core';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';
import { dictionary } from 'src/app/data/dictionary/dictionary.model';
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

  constructor(private configurationService: ConfigurationService) {
    this.dictionary = new dictionary({
      language: 'de',
      additional_vocab: [{ content: '', sounds_like: [''] }],
    });

    this.alphabeticBoolean = true;
  }

  ngOnInit(): void {
    this.configurationService.dictionaryUpdated.subscribe(
      (updatedDictionary: dictionary) => {
        this.dictionary = updatedDictionary;
      },
    );

    this.configurationService.newDictionaryUploaded.subscribe(
      (uploadedDictionary: dictionary) => {
        this.dictionary.mergeWithDictionary(uploadedDictionary);
      },
    );
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
    const index =
      this.dictionary.transcription_config.additional_vocab.indexOf(row);
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
