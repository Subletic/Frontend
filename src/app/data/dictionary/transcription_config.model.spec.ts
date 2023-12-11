import { transcription_config } from './transcription_config.module';
import { additional_vocab } from './additionalVocab.model';

describe('transcription_config', () => {
  it('should throw an error if additional_vocab array exceeds 1000 elements', () => {
    const additionalVocabArray: additional_vocab[] = [];
    for (let i = 0; i < 1001; i++) {
      additionalVocabArray.push(new additional_vocab(`Word_${i}`));
    }

    const createTranscriptionConfig = () => {
      new transcription_config('en', additionalVocabArray);
    };

    expect(createTranscriptionConfig).toThrowError('additional_vocab array cannot exceed 1000 elements.');
  });

  it('should not throw an error if additional_vocab array has 1000 or fewer elements', () => {
    const additionalVocabArray: additional_vocab[] = [];
    for (let i = 0; i < 1000; i++) {
      additionalVocabArray.push(new additional_vocab(`Word_${i}`));
    }

    const createTranscriptionConfig = () => {
      new transcription_config('en', additionalVocabArray);
    };

    expect(createTranscriptionConfig).not.toThrow();
  });
});
