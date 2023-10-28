import { WordToken } from './wordToken.model';

describe('WordToken', () => {
  it('should set the word correctly', () => {
    const token = new WordToken('apple', 0.8, 10, 20, 1);
    expect(token.word).toBe('apple');

    token.setWord('banana');
    expect(token.word).toBe('banana');
  });

  it('should return the correct export object', () => {
    const TOKEN = new WordToken('apple', 0.8, 10, 20, 1);
    const EXPECTED_EXPORT = {
      Word: 'apple',
      Confidence: 0.8,
      StartTime: 10,
      EndTime: 20,
      Speaker: 1
    };

    const EXPORTED = TOKEN.getExport();
    expect(JSON.stringify(EXPORTED)).toEqual(JSON.stringify(EXPECTED_EXPORT));
  });

  it('should update word value correctly', () => {
    const token = new WordToken('apple', 0.8, 10, 20, 1);
    expect(token.word).toBe('apple');

    token.setWord('banana');
    expect(token.word).toBe('banana');

    token.setWord('');
    expect(token.word).toBe('');

    token.setWord('grape');
    expect(token.word).toBe('grape');
  });
});