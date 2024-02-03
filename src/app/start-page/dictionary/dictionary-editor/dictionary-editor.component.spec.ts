import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DictionaryEditorComponent } from './dictionary-editor.component';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';
import { dictionary } from 'src/app/data/dictionary/dictionary.model';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { Subscription } from 'rxjs';
import { transcription_config } from 'src/app/data/dictionary/transcription_config.module';
import { DictionaryFsLoaderComponent } from '../dictionary-fs-loader/dictionary-fs-loader.component';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DictionaryRowComponent } from '../dictionary-row/dictionary-row.component';

describe('DictionaryEditorComponent', () => {
  let component: DictionaryEditorComponent;
  let fixture: ComponentFixture<DictionaryEditorComponent>;
  let dictionaryService: ConfigurationService;
  let toastrService: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DictionaryEditorComponent,
        DictionaryFsLoaderComponent,
        DictionaryRowComponent,
      ],
      imports: [ToastrModule.forRoot()],
      providers: [ConfigurationService, ToastrService],
    });

    fixture = TestBed.createComponent(DictionaryEditorComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService);
    dictionaryService = TestBed.inject(ConfigurationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new row to the dictionary', () => {
    const initialRows = component.dictionary.transcription_config.additional_vocab.length;

    component.addRow();

    expect(component.dictionary.transcription_config.additional_vocab.length).toEqual(
      initialRows + 1,
    );
  });

  it('should delete a row from the dictionary', () => {
    const row: additional_vocab = { content: 'test', sounds_like: ['test'] };
    component.dictionary.transcription_config.additional_vocab.push(row);

    const initialRows = component.dictionary.transcription_config.additional_vocab.length;

    component.onDeleteRow(row);

    expect(component.dictionary.transcription_config.additional_vocab.length).toEqual(
      initialRows - 1,
    );
  });

  it('should sort alphabetically and reverse alphabetically', () => {
    const row1: additional_vocab = {
      content: 'banana',
      sounds_like: ['test'],
    };
    const row2: additional_vocab = {
      content: 'apple',
      sounds_like: ['test'],
    };
    component.dictionary.transcription_config.additional_vocab.push(row1, row2);

    // Nullwert am Anfang beachten!
    component.sortAlphabeticallyCall();
    expect(component.dictionary.transcription_config.additional_vocab[1].content).toBe('apple');

    component.sortAlphabeticallyCall();
    expect(component.dictionary.transcription_config.additional_vocab[0].content).toBe('banana');
  });

  it('should update dictionary when service emits update', () => {
    const TRANSCRIPTION_CONFIG = new transcription_config('en', [
      { content: 'updated', sounds_like: ['test'] },
    ]);
    const UPDATED_DICTIONARY: dictionary = new dictionary(TRANSCRIPTION_CONFIG);

    spyOn(dictionaryService.dictionaryUpdated, 'subscribe').and.callFake(
      (callback: (value: dictionary) => void) => {
        callback(UPDATED_DICTIONARY);
        return {
          unsubscribe: () => {
            console.log();
          },
        } as Subscription;
      },
    );

    dictionaryService.updateDictionary(UPDATED_DICTIONARY);

    expect(component.dictionary).toEqual(UPDATED_DICTIONARY);
  });

  it('should navigate to the previous change and update hasPrev', () => {
    const initialState = new dictionary({
      language: 'de',
      additional_vocab: [{ content: 'initial', sounds_like: [''] }],
    });
    const newState = new dictionary({
      language: 'de',
      additional_vocab: [{ content: 'new', sounds_like: [''] }],
    });

    // Set initial and new states
    dictionaryService.updateDictionary(initialState);
    dictionaryService.updateDictionary(newState);

    // Ensure initial state is the current state
    expect(component.dictionary).toEqual(newState);

    // Navigate to the previous state
    component.goToPreviousChange();

    // Ensure dictionary is updated to the initial state
    expect(component.dictionary).toEqual(initialState);

    // Ensure hasPrev and hasNext are updated correctly
    expect(component.hasPrev).toBeTrue();
    expect(component.hasNext).toBeTrue();
  });

  it('should navigate to the next change and update hasNext', () => {
    const initialState = new dictionary({
      language: 'de',
      additional_vocab: [{ content: 'initial', sounds_like: [''] }],
    });
    const newState = new dictionary({
      language: 'de',
      additional_vocab: [{ content: 'new', sounds_like: [''] }],
    });

    // Set initial and new states
    dictionaryService.updateDictionary(initialState);
    dictionaryService.updateDictionary(newState);

    // Navigate to the previous state
    component.goToPreviousChange();

    // Ensure initial state is the current state
    expect(component.dictionary).toEqual(initialState);

    // Navigate to the next state
    component.goToNextChange();

    // Ensure dictionary is updated to the new state
    expect(component.dictionary).toEqual(newState);

    // Ensure hasPrev and hasNext are updated correctly
    expect(component.hasPrev).toBeTrue();
    expect(component.hasNext).toBeFalse();
  });

  it('should update word count and show warning if count is over 1000', () => {
    // Arrange
    component.dictionary.transcription_config.additional_vocab = Array(1001).fill({
      content: 'test',
      sounds_like: ['test'],
    });

    spyOn(toastrService, 'warning');

    // Act
    component.updateWordCount();

    // Assert
    expect(component.wordcount).toBe(1001);
    expect(toastrService.warning).toHaveBeenCalledWith(
      'Achtung: Die maximale Anzahl von 1000 Wörtern wurde überschritten.',
      'Fehler',
    );
  });

  it('should update word count without warning if count is 1000 or less', () => {
    // Arrange
    component.dictionary.transcription_config.additional_vocab = Array(1000).fill({
      content: 'test',
      sounds_like: ['test'],
    });

    spyOn(toastrService, 'warning');

    // Act
    component.updateWordCount();

    // Assert
    expect(component.wordcount).toBe(1000);
    expect(toastrService.warning).not.toHaveBeenCalled();
  });

  it('should clear the dictionary', () => {
    // Arrange: Set up the component's initial state
    const initialDictionary = new dictionary({
      language: 'de',
      additional_vocab: [{ content: 'word1', sounds_like: ['sound1'] }],
    });
    component.dictionary = initialDictionary;

    // Act: Call the method to be tested
    component.clearDictionary();

    spyOn(dictionaryService, 'updateDictionary');

    // Assert: Check if the dictionary is cleared and the service is updated
    expect(component.dictionary).toEqual(
      new dictionary({
        language: 'de',
        additional_vocab: [{ content: '', sounds_like: [''] }],
      }),
    );
  });
});
