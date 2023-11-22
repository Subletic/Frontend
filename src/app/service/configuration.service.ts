import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {dictionary} from "../data/dictionary/dictionary.model";
import {transcription_config} from "../data/dictionary/transcription_config.module";
import {additional_vocab} from "../data/dictionary/additionalVocab.model";
import {environment} from "../../environments/environment";
import {Config} from "../data/config/config.model";

/**
 * Service to provide the dictionary to the components.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  public dictionaryUpdated: Subject<dictionary> = new Subject<dictionary>();
  public currentDictionary: dictionary;
  public delayLengthInMinutes: number;

  /**
   * Initializes the dictionary with default values.
   */
  constructor() {
    const DEFAULT_DICTIONARY = this.generateDefaultDictionary();

    this.currentDictionary = DEFAULT_DICTIONARY;
    this.delayLengthInMinutes = 2;
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

  public getDictionary(): dictionary {
    return this.currentDictionary;
  }

  public updateDelayLength(delayLength: number): void {
    this.delayLengthInMinutes = delayLength;
  }

  // /**
  //  * Posts updated dictionary to backend.
  //  */
  // public postDictionaryToBackend(): void {
  //   fetch(environment.apiURL + "/api/CustomDictionary/upload", {
  //     method: "POST",
  //     body: JSON.stringify(this.currentDictionary),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     }).then((response) => {
  //       console.log(response)
  //       if (response.ok) return;
  //       console.error("Error while uploading dictionary to backend.")
  //   })
  // }

  public postConfigurationToBackend(): void {
    const CONFIG = new Config(
      this.currentDictionary,
      this.delayLengthInMinutes
    )

    fetch(environment.apiURL + "/api/Configuration/upload", {
      method: "POST",
      body: JSON.stringify(CONFIG),
      headers: {
        'Content-Type': 'application/json'
      },
      }).then((response) => {
        console.log(response)
        if (response.ok) return;
        console.error("Error while uploading configuration to backend.")
    })
  }
}
