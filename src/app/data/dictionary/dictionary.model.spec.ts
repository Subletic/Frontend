import { additional_vocab } from './additionalVocab.model';
import { transcription_config } from './transcription_config.module';
import { dictionary } from './dictionary.model';

describe('Dictionary', () => {
  it('should generate the expected JSON format', () => {
    const additionalVocab1 = new additional_vocab('financial crisis');
    const additionalVocab2 = new additional_vocab('gnocchi', [
      'nyohki',
      'nokey',
      'nochi',
    ]);
    const additionalVocab3 = new additional_vocab('CEO', ['C.E.O.']);

    const transcriptionConfig = new transcription_config('en', [
      additionalVocab1,
      additionalVocab2,
      additionalVocab3,
    ]);

    const testDictionary = new dictionary(transcriptionConfig);

    const EXPECTED_JSON_FORMAT_BY_SPEECHMATICS = {
      transcription_config: {
        language: 'en',
        additional_vocab: [
          { content: 'financial crisis' },
          {
            content: 'gnocchi',
            sounds_like: ['nyohki', 'nokey', 'nochi'],
          },
          { content: 'CEO', sounds_like: ['C.E.O.'] },
        ],
      },
    };

    const CREATED_JSON_FORMAT_BY_DATASTRUCTURE = JSON.stringify(testDictionary);

    expect(JSON.parse(CREATED_JSON_FORMAT_BY_DATASTRUCTURE)).toEqual(
      EXPECTED_JSON_FORMAT_BY_SPEECHMATICS,
    );
  });
});
