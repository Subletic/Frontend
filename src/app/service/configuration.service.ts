import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { dictionary } from '../data/dictionary/dictionary.model';
import { transcription_config } from '../data/dictionary/transcription_config.module';
import { additional_vocab } from '../data/dictionary/additionalVocab.model';
import { environment } from '../../environments/environment.prod';
import { Config } from '../data/config/config.model';
import { DictionaryError } from '../data/error/DictionaryError';
import { BackendProviderService } from './backend-provider.service';

/**
 * Service to provide the dictionary to the components.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  public dictionaryUpdated: Subject<dictionary> = new Subject<dictionary>();
  public newDictionaryUploaded: Subject<dictionary> = new Subject<dictionary>();
  public currentDictionary: dictionary;
  public delayLengthInMinutes: number;

  /**
   * Initializes the dictionary with default values.
   */
  constructor(private backendProviderService: BackendProviderService) {
    const DEFAULT_DICTIONARY = this.generateDefaultDictionary();
    this.currentDictionary = DEFAULT_DICTIONARY;
    this.delayLengthInMinutes = 2;
    this.dictionaryUpdated.next(DEFAULT_DICTIONARY);
    console.log('backendUrl: ' + environment.BACKEND_URL);
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

  public newDictionaryUpload(dictionary: dictionary): void {
    //Hier dann durch Logik ersetzen, die CSV/JSON Upload unterscheidet oder in eigene Methoden auslagern
    this.newDictionaryUploaded.next(dictionary);
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
   * @throws DictionaryError if the configuration is invalid
   */
  public isConfigValid(): void {
    const VALID_BUFFER_LENGTHS = [
      0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10,
    ];
    if (
      !VALID_BUFFER_LENGTHS.includes(this.delayLengthInMinutes) ||
      isNaN(this.delayLengthInMinutes)
    ) {
      throw new DictionaryError('Ungültige Buffer Länge!');
    }

    if (
      this.currentDictionary.transcription_config.additional_vocab.length > 1000
    ) {
      throw new DictionaryError(
        'Maximale SoundsLike Anzahl überschritten (1000)!',
      );
    }

    // Check if sounds like exists for empty word
    for (const word of this.currentDictionary.transcription_config
      .additional_vocab) {
      if (
        !word.content &&
        word.sounds_like != null &&
        word.sounds_like.length > 0
      ) {
        throw new DictionaryError('SoundsLike Angaben fehlerhaft!');
      }
    }

    // Check if language provided
    if (!this.currentDictionary.transcription_config.language)
      throw new DictionaryError('Keine Sprache angegeben!');
  }

  /**
   * Posts the current configuration to the backend.
   */
  public postConfigurationToBackend(): void {
    const CONFIG = new Config(
      this.currentDictionary.transcription_config,
      this.delayLengthInMinutes,
    );

    this.backendProviderService.uploadConfiguration(CONFIG);
  }
}
