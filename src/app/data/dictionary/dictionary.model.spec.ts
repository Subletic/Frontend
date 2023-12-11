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

  it('should merge two dictionaries correctly', () => {
    // Create the first dictionary
    const additionalVocab1 = new additional_vocab('financial crisis');
    const additionalVocab2 = new additional_vocab('gnocchi', [
      'nyohki',
      'nokey',
      'nochi',
    ]);
    const additionalVocab3 = new additional_vocab('CEO', ['C.E.O.']);
    const transcriptionConfig1 = new transcription_config('en', [
      additionalVocab1,
      additionalVocab2,
      additionalVocab3,
    ]);
    const dictionary1 = new dictionary(transcriptionConfig1);

    // Create the second dictionary
    const additionalVocab4 = new additional_vocab('gnocchi', ['new_sound']);
    const additionalVocab5 = new additional_vocab('team', ['T.E.A.M.']);
    const transcriptionConfig2 = new transcription_config('en', [
      additionalVocab4,
      additionalVocab5,
    ]);
    const dictionary2 = new dictionary(transcriptionConfig2);

    dictionary1.mergeWithDictionary(dictionary2);

    // Verify the merged result
    const EXPECTED_MERGED_JSON_FORMAT = {
      transcription_config: {
        language: 'en',
        additional_vocab: [
          { content: 'financial crisis' },
          {
            content: 'gnocchi',
            sounds_like: ['nyohki', 'nokey', 'nochi', 'new_sound'],
          },
          { content: 'CEO', sounds_like: ['C.E.O.'] },
          { content: 'team', sounds_like: ['T.E.A.M.'] },
        ],
      },
    };

    const CREATED_MERGED_JSON_FORMAT = JSON.stringify(dictionary1);

    expect(JSON.parse(CREATED_MERGED_JSON_FORMAT)).toEqual(
      EXPECTED_MERGED_JSON_FORMAT,
    );
  });
});
