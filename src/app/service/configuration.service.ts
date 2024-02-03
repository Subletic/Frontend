import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { dictionary } from '../data/dictionary/dictionary.model';
import { transcription_config } from '../data/dictionary/transcription_config.module';
import { additional_vocab } from '../data/dictionary/additionalVocab.model';
import { environment } from '../../environments/environment.prod';
import { Config } from '../data/config/config.model';
import { DictionaryError } from '../data/error/DictionaryError';
import { BackendProviderService } from './backend-provider.service';
import { ToastrService } from 'ngx-toastr';

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
  constructor(
    private backendProviderService: BackendProviderService,
    private toastr: ToastrService,
  ) {
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

  public newDictionaryUpload(dictionary: dictionary): void {
    // Hier dann durch Logik ersetzen, die CSV/JSON Upload unterscheidet oder in eigene Methoden auslagern
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
    const ADDITIONAL_VOCAB = this.currentDictionary.transcription_config.additional_vocab;
    const VALID_BUFFER_LENGTHS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10];
    if (
      !VALID_BUFFER_LENGTHS.includes(this.delayLengthInMinutes) ||
      isNaN(this.delayLengthInMinutes)
    ) {
      throw new DictionaryError('Ungültige Buffer Länge!');
    }

    if (ADDITIONAL_VOCAB.length > 1000) {
      throw new DictionaryError('Maximale Anzahl an Wörterbucheinträgen überschritten (1000)!');
    }

    for (let i = 0; i < ADDITIONAL_VOCAB.length; i++) {
      const vocabItem = ADDITIONAL_VOCAB[i];
      const soundsLike = vocabItem.sounds_like;
      const content = vocabItem.content;
      const filteredSoundsLike = soundsLike?.filter((s) => s.trim() !== '') ?? [];

      // Check if content is provided and not empty or just whitespace
      if ((!content || content.trim() == '') && filteredSoundsLike.length > 0) {
        throw new DictionaryError(
          'In mind. einer Zeile wurde zu einem klangähnlichen Wort kein benutzerdefiniertes Wort angegeben!',
        );
      }
    }
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
