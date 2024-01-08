import { CsvHandler } from './dictionary-format-csv';
import { dictionary } from '../../../../data/dictionary/dictionary.model';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';
import { transcription_config } from 'src/app/data/dictionary/transcription_config.module';

describe('CsvHandler', () => {
    let csvHandler: CsvHandler;

    beforeEach(() => {
        csvHandler = new CsvHandler();
    });

    it('should be created', () => {
        expect(csvHandler).toBeTruthy();
    });

    it('should download a dictionary as CSV file', () => {
        const fileName = 'test.csv';
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

        csvHandler.downloadDictionary(fileName, mockDictionary);

        expect(window.URL.createObjectURL).toHaveBeenCalledWith(jasmine.any(Blob));
        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(window.URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should convert a CSV-formatted string to a dictionary object', () => {
        const VALID_CSV_AS_STRING =
            'Content;SoundsLike\n' +
            'gnocchi;nokki;gnotchi\n' +
            'Baum;Raum;Saum';
        const vocab1 = new additional_vocab('gnocchi', ['nokki', 'gnotchi']);
        const vocab2 = new additional_vocab('Baum', ['Raum', 'Saum']);
        const config = new transcription_config('de', [vocab1, vocab2]);
        const expectedDictionary: dictionary = new dictionary(config);

        const result = csvHandler.convertToDictionary(VALID_CSV_AS_STRING);

        expect(result.transcription_config.language).toEqual(expectedDictionary.transcription_config.language);
        expect(result.transcription_config.additional_vocab).toEqual(jasmine.arrayContaining(expectedDictionary.transcription_config.additional_vocab));
    });
});
