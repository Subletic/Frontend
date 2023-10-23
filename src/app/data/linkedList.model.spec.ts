import { LinkedList } from './linkedList.model';
import { WordToken } from './wordToken.model';

describe('LinkedList', () => {
  let linkedList: LinkedList<WordToken>;
  let wordToken1: WordToken;
  let wordToken2: WordToken;
  let wordToken3: WordToken;

  beforeEach(() => {
    linkedList = new LinkedList<WordToken>();
    wordToken1 = new WordToken('Hello', 0.9, 0, 1, 1);
    wordToken2 = new WordToken('World', 0.8, 2, 3, 1);
    wordToken3 = new WordToken('!', 0.7, 4, 5, 1);
  });

  it('should correctly initialize LinkedList instance', () => {
    expect(linkedList.head).toBeNull();
    expect(linkedList.tail).toBeNull();
    expect(linkedList.currentIndex).toBe(0);
  });

  it('should add WordToken to LinkedList', () => {
    linkedList.add(wordToken1);
    linkedList.add(wordToken2);

    expect(linkedList.head?.data).toEqual(wordToken1);
    expect(linkedList.tail?.data).toEqual(wordToken2);
    expect(linkedList.size()).toBe(2);
  });

  it('should remove WordToken from LinkedList', () => {
    linkedList.add(wordToken1);
    linkedList.add(wordToken2);
    linkedList.add(wordToken3);

    linkedList.remove(wordToken2);

    expect(linkedList.head?.data).toEqual(wordToken1);
    expect(linkedList.tail?.data).toEqual(wordToken3);
    expect(linkedList.size()).toBe(2);
  });

  it('should print the word list of LinkedList', () => {
    linkedList.add(wordToken1);
    linkedList.add(wordToken2);
    linkedList.add(wordToken3);

    const expectedText = 'Hello World !';
    const result = linkedList.printDataList((data: WordToken) => data.word);
    expect(result).toBe(expectedText);
  });

  it('should convert LinkedList instance to JSON', () => {
    linkedList.add(wordToken1);
    linkedList.add(wordToken2);
    linkedList.add(wordToken3);

    const expectedJson = [
      {
        Word: 'Hello',
        Confidence: 0.9,
        StartTime: 0,
        EndTime: 1,
        Speaker: 1
      },
      {
        Word: 'World',
        Confidence: 0.8,
        StartTime: 2,
        EndTime: 3,
        Speaker: 1
      },
      {
        Word: '!',
        Confidence: 0.7,
        StartTime: 4,
        EndTime: 5,
        Speaker: 1
      }
    ];

    const json = linkedList.toJSON((data: WordToken) => data.getExport());

    expect(json).toEqual(JSON.stringify(expectedJson));
  });
});
