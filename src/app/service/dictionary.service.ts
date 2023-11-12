import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {dictionary} from "../data/dictionary/dictionary.model";
import {transcription_config} from "../data/dictionary/transcription_config.module";
import {additional_vocab} from "../data/dictionary/additionalVocab.model";

/**
 * Service to provide the dictionary to the components.
 */
@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  public dictionaryUpdated: Subject<dictionary> = new Subject<dictionary>();
  public currentDictionary: dictionary;

  /**
   * Initializes the dictionary with default values.
   */
  constructor() {
    const DEFAULT_DICTIONARY = this.generateDefaultDictionary();

    this.currentDictionary = DEFAULT_DICTIONARY;
    this.dictionaryUpdated.next(DEFAULT_DICTIONARY);
  }

  /**
   * Generates a default dictionary.
   */
  private generateDefaultDictionary(): dictionary {
    const LANGUAGE = "de"
    const ADDITIONAL_VOCAB: additional_vocab[] = [];
    const TRANSCRIPTION_CONFIG = new transcription_config(LANGUAGE, ADDITIONAL_VOCAB);

    return new dictionary(TRANSCRIPTION_CONFIG);
  }

  /**
   * Updates the dictionary and notifies all subscribers.
   * @param dictionary New dictionary
   */
  public updateDictionary(dictionary: dictionary): void {
    this.currentDictionary = dictionary;
    this.dictionaryUpdated.next(dictionary);
  }

  /**
   * Returns the current dictionary.
   * Used for dictionary export to filesystem.
   */
  public getDictionary(): dictionary {
    return this.currentDictionary;
  }
}
