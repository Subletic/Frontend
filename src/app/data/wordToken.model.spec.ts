import { WordToken } from './wordToken.model';

describe('WordToken', () => {
  it('should set the word correctly', () => {
    const token = new WordToken('apple', 0.8, 10, 20, 1);
    expect(token.word).toBe('apple');

    token.setWord('banana');
    expect(token.word).toBe('banana');
  });

  it('should return the correct export object', () => {
    const token = new WordToken('apple', 0.8, 10, 20, 1);
    const expectedExport = {
      Word: 'apple',
      Confidence: 0.8,
      StartTime: 10,
      EndTime: 20,
      Speaker: 1
    };

    const exported = token.getExport();
    expect(JSON.stringify(exported)).toEqual(JSON.stringify(expectedExport));
  });

  it('should have correct initial values for prev and next properties', () => {
    const token = new WordToken('apple', 0.8, 10, 20, 1);
    expect(token.prev).toBeNull();
    expect(token.next).toBeNull();
  });

  it('should correctly update prev and next properties', () => {
    const token1 = new WordToken('apple', 0.8, 10, 20, 1);
    const token2 = new WordToken('banana', 0.9, 30, 40, 1);

    token1.next = token2;
    token2.prev = token1;

    expect(token1.next).toBe(token2);
    expect(token2.prev).toBe(token1);
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

  it('should have unique IDs for each instance', () => {
    const token1 = new WordToken('apple', 0.8, 10, 20, 1);
    const token2 = new WordToken('banana', 0.9, 30, 40, 1);
    const token3 = new WordToken('orange', 0.7, 50, 60, 2);

    expect(token1.id).not.toBe(token2.id);
    expect(token1.id).not.toBe(token3.id);
    expect(token2.id).not.toBe(token3.id);
  });
});
