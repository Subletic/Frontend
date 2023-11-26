import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { dictionary } from '../data/dictionary/dictionary.model';
import { transcription_config } from '../data/dictionary/transcription_config.module';
import { additional_vocab } from '../data/dictionary/additionalVocab.model';
import { environment } from '../../environments/environment';
import { Config } from '../data/config/config.model';

/**
 * Service to provide the dictionary to the components.
 */
@Injectable({
  providedIn: 'root',
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
    const LANGUAGE = 'de';
    const ADDITIONAL_VOCAB: additional_vocab[] = [];
    const TRANSCRIPTION_CONFIG = new transcription_config(
      LANGUAGE,
      ADDITIONAL_VOCAB,
    );

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
   */
  public getDictionary(): dictionary {
    return this.currentDictionary;
  }

  /**
   * Returns the delay length in minutes.
   */
  public getBufferLengthInMinutes(): number {
    return this.delayLengthInMinutes;
  }

  /**
   * Updates the delay length in minutes.
   * @param delayLength New delay length in minutes
   */
  public updateDelayLength(delayLength: number): void {
    this.delayLengthInMinutes = delayLength;
  }

  /**
   * Checks if the current configuration is valid before posting to the backend.
   * @returns True if configuration is valid, false otherwise.
   */
  public isConfigValid(): boolean {
    // Check if delay length is valid
    if (
      this.delayLengthInMinutes < 0.5 ||
      this.delayLengthInMinutes > 10 ||
      isNaN(this.delayLengthInMinutes)
    ) {
      return false;
    }

    // Check if sounds like exists for empty word
    for (const word of this.currentDictionary.transcription_config
      .additional_vocab) {
      if (
        word.content == '' &&
        word.sounds_like != null &&
        word.sounds_like.length > 0
      ) {
        return false;
      }
    }

    // Check if language provided
    if (!this.currentDictionary.transcription_config.language) return false;

    return true;
  }

  /**
   * Posts the current configuration to the backend.
   */
  public postConfigurationToBackend(): void {
    const CONFIG = new Config(
      this.currentDictionary,
      this.delayLengthInMinutes,
    );

    fetch(environment.apiURL + '/api/Configuration/upload', {
      method: 'POST',
      body: JSON.stringify(CONFIG),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log(response);
      if (response.ok) return;
      console.error('Error while uploading configuration to backend.');
    });
  }
}
