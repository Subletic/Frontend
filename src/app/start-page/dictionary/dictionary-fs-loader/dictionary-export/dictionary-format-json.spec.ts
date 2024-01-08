import { JsonHandler } from './dictionary-format-json';
import { dictionary } from '../../../../data/dictionary/dictionary.model';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';
import { transcription_config } from 'src/app/data/dictionary/transcription_config.module';

describe('JsonHandler', () => {
  let jsonHandler: JsonHandler;

  beforeEach(() => {
    jsonHandler = new JsonHandler();
  });

  it('should be created', () => {
    expect(jsonHandler).toBeTruthy();
  });

  it('should download a dictionary as JSON file', () => {
    const fileName = 'test.json';
    const vocab1 = new additional_vocab('gnocchi', ['nokki', 'gnotchi']);
    const vocab2 = new additional_vocab('Baum', ['Raum', 'Saum']);
    const config1 = new transcription_config('de', [vocab1, vocab2]);
    const mockDictionary: dictionary = new dictionary(config1);

    spyOn(window.URL, 'createObjectURL');
    spyOn(window.URL, 'revokeObjectURL');
    const anchorElement: unknown = {
      href: '',
      download: '',
      click: jasmine.createSpy('click'),
    };

    spyOn(document, 'createElement').and.returnValue(anchorElement as HTMLAnchorElement);

    jsonHandler.downloadDictionary(fileName, mockDictionary);

    expect(window.URL.createObjectURL).toHaveBeenCalledWith(jasmine.any(Blob));
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(window.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('should convert a JSON-formatted string to a dictionary object', () => {
    const VALID_JSON_AS_STRING =
      '{ "transcription_config": { "language": "de", "additional_vocab": [ { "content": "gnocchi", "sounds_like": [ "nyohki", "nokey", "nochi" ] }, { "content": "CEO", "sounds_like": [ "C.E.O." ] } ] } }';
    const vocab = new additional_vocab('gnocchi', ['nyohki', 'nokey', 'nochi']);
    const vocab2 = new additional_vocab('CEO', ['C.E.O.']);
    const config = new transcription_config('de', [vocab, vocab2]);
    const expectedDictionary: dictionary = new dictionary(config);

    const result = jsonHandler.convertToDictionary(VALID_JSON_AS_STRING);

    expect(result.transcription_config.language).toEqual(
      expectedDictionary.transcription_config.language,
    );
    expect(result.transcription_config.additional_vocab).toEqual(
      jasmine.arrayContaining([jasmine.objectContaining(vocab), jasmine.objectContaining(vocab2)]),
    );
  });
});
