import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DictionaryFsLoaderComponent } from './dictionary-fs-loader.component';
import { ToastrService } from 'ngx-toastr';
import createSpyObj = jasmine.createSpyObj;
import { transcription_config } from '../../data/dictionary/transcription_config.module';
import { dictionary } from '../../data/dictionary/dictionary.model';

describe('DictionaryFsLoaderComponent', () => {
  let component: DictionaryFsLoaderComponent;
  let fixture: ComponentFixture<DictionaryFsLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DictionaryFsLoaderComponent],
      providers: [{ provide: ToastrService, useValue: ToastrService }],
    });
    fixture = TestBed.createComponent(DictionaryFsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept a valid JSON file', async () => {
    const VALID_JSON_AS_STRING =
      '{ "transcription_config": { "language": "en", "additional_vocab": [ { "content": "financial crisis" }, { "content": "gnocchi", "sounds_like": [ "nyohki", "nokey", "nochi" ] }, { "content": "CEO", "sounds_like": [ "C.E.O." ] } ] } }';
    const MOCK_FILE = new File([VALID_JSON_AS_STRING], 'validjson.json', {
      type: 'application/json',
    });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE],
      },
    } as unknown as Event;

    spyOn(component, 'displayDictionarySuccessToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionarySuccessToast).toHaveBeenCalled();
  });

  it('should not accept a invalid JSON file', async () => {
    const INVALID_JSON_AS_STRING = 'invalid';
    const MOCK_FILE = new File([INVALID_JSON_AS_STRING], 'invalidjson.json', {
      type: 'application/json',
    });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE],
      },
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalled();
  });

  it('should not accept a JSON file containing empty language', async () => {
    const INVALID_JSON_AS_STRING =
      '{ "transcription_config": { "language": "", "additional_vocab": [ { "content": "financial crisis" }, { "content": "gnocchi", "sounds_like": [ "nyohki", "nokey", "nochi" ] }, { "content": "CEO", "sounds_like": [ "C.E.O." ] } ] } }';
    const MOCK_FILE = new File([INVALID_JSON_AS_STRING], 'invalidjson.json', {
      type: 'application/json',
    });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE],
      },
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalledWith(
      'Keine Sprache angegeben!',
    );
  });

  it('should accept a JSON file containing empty additional vocab', async () => {
    const VALID_JSON_AS_STRING =
      '{ "transcription_config": { "language": "en", "additional_vocab": [] } }';
    const MOCK_FILE = new File([VALID_JSON_AS_STRING], 'valid.json', {
      type: 'application/json',
    });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE],
      },
    } as unknown as Event;

    spyOn(component, 'displayDictionarySuccessToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionarySuccessToast).toHaveBeenCalled();
  });

  it('should not accept a JSON file containing no additional vocab', async () => {
    const VALID_JSON_AS_STRING =
      '{ "transcription_config": { "language": "en", "additional_vocab": null } }';
    const MOCK_FILE = new File([VALID_JSON_AS_STRING], 'valid.json', {
      type: 'application/json',
    });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE],
      },
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalledWith(
      'Kein SoundsLike angegeben!',
    );
  });

  it('should accept a JSON file containing empty sounds like', async () => {
    const VALID_JSON_AS_STRING =
      '{ "transcription_config": { "language": "en", "additional_vocab": [ { "content": "financial crisis" }, { "content": "gnocchi", "sounds_like": [] }, { "content": "CEO", "sounds_like": [ "C.E.O." ] } ] } }';
    const MOCK_FILE = new File([VALID_JSON_AS_STRING], 'valid.json', {
      type: 'application/json',
    });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE],
      },
    } as unknown as Event;

    spyOn(component, 'displayDictionarySuccessToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionarySuccessToast).toHaveBeenCalled();
  });

  it('should not accept a JSON file containing empty content', async () => {
    const INVALID_JSON_AS_STRING = '{}';
    const MOCK_FILE = new File([INVALID_JSON_AS_STRING], 'invalidjson.json', {
      type: 'application/json',
    });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE],
      },
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalledWith();
  });

  it('should not accept a JSON file containing soundsLike with empty content', async () => {
    const INVALID_JSON_AS_STRING =
      '{ "transcription_config": { "language": "en", "additional_vocab": [ { "content": "financial crisis" }, { "content": "gnocchi", "sounds_like": [] }, { "content": "", "sounds_like": [ "C.E.O." ] } ] } }';
    const MOCK_FILE = new File([INVALID_JSON_AS_STRING], 'invalidjson.json', {
      type: 'application/json',
    });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE],
      },
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalledWith(
      'SoundsLike Angaben fehlerhaft!',
    );
  });

  it('should not accept a JSON file containing soundsLike with empty content', async () => {
    const transcriptionConfig = new transcription_config('de', [
      { content: 'asdf', sounds_like: ['test'] },
    ]);
    for (let i = 0; i < 1001; i++) {
      transcriptionConfig.additional_vocab.push({
        content: 'asdf' + i,
        sounds_like: ['test'],
      });
    }

    const DICTIONARY = new dictionary(transcriptionConfig);

    const MOCK_FILE = new File(
      [JSON.stringify(DICTIONARY)],
      'invalidjson.json',
      {
        type: 'application/json',
      },
    );
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE],
      },
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalledWith(
      'Maximale SoundsLike Anzahl überschritten (1000)!',
    );
  });

  it('should not accept a null file', async () => {
    const MOCK_FILE = null;
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE],
      },
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalledWith();
  });
});
