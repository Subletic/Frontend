import { WordToken } from '../wordToken/wordToken.model';
import { SpeechBubble } from './speechBubble.model';
import { LinkedList } from '../linkedList/linkedList.model';

describe('SpeechBubble', () => {
  let speechBubble: SpeechBubble;
  let wordToken1: WordToken;
  let wordToken2: WordToken;

  beforeEach(() => {
    speechBubble = new SpeechBubble(1, 0, 3, new LinkedList<WordToken>(), 1);
    wordToken1 = new WordToken('Hello', 0.9, 0, 1, 1);
    wordToken2 = new WordToken('World', 0.8, 2, 3, 1);
  });

  it('should correctly initialize SpeechBubble instance', () => {
    expect(speechBubble.speaker).toBe(1);
    expect(speechBubble.begin).toBe(0);
    expect(speechBubble.end).toBe(3);
    expect(speechBubble.words.size()).toBe(0);
    expect(speechBubble.id).toBe(1);
  });

  it('should add WordToken to SpeechBubble', () => {
    speechBubble.words.add(wordToken1);
    speechBubble.words.add(wordToken2);

    expect(speechBubble.words.size()).toBe(2);
    expect(speechBubble.words.head?.data).toEqual(wordToken1);
    expect(speechBubble.words.tail?.data).toEqual(wordToken2);
  });

  it('should remove WordToken from SpeechBubble', () => {
    speechBubble.words.add(wordToken1);
    speechBubble.words.add(wordToken2);

    speechBubble.words.remove(wordToken1);

    expect(speechBubble.words.size()).toBe(1);
    expect(speechBubble.words.head?.data).toEqual(wordToken2);
    expect(speechBubble.words.tail?.data).toEqual(wordToken2);
  });

  it('should print the text of SpeechBubble', () => {
    speechBubble.words.add(wordToken1);
    speechBubble.words.add(wordToken2);

    const EXPECTED_TEXT = '[Hello, World]';
    expect(speechBubble.printText()).toBe(EXPECTED_TEXT);
  });

  it('should convert SpeechBubble instance to SpeechBubbleExport', () => {
    speechBubble.words.add(wordToken1);
    speechBubble.words.add(wordToken2);

    const speechBubbleExport = speechBubble.getExport();

    expect(speechBubbleExport.id).toBe(1);
    expect(speechBubbleExport.speaker).toBe(1);
    expect(speechBubbleExport.startTime).toBe(0);
    expect(speechBubbleExport.endTime).toBe(3);
    expect(speechBubbleExport.speechBubbleContent.length).toBe(2);
    expect(speechBubbleExport.speechBubbleContent[0]).toEqual(
      wordToken1.getExport(),
    );
    expect(speechBubbleExport.speechBubbleContent[1]).toEqual(
      wordToken2.getExport(),
    );
  });

  it('should not remove any words when the LinkedList is empty', () => {
    // Arrange
    const WORDTOKEN = new WordToken('', 1, 1, 1, 1);
    const linkedList = new LinkedList<WordToken>();
    linkedList.add(WORDTOKEN);

    const emptySpeechBubble = new SpeechBubble(1, 0, 10, linkedList);

    // Act
    emptySpeechBubble.removeEmptyWords();

    // Assert
    expect(emptySpeechBubble.words.head?.data).toBe(WORDTOKEN);
    expect(emptySpeechBubble.words.tail?.data).toBe(WORDTOKEN);
  });
});

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

    expect(linkedList.size()).toBe(2);
    expect(linkedList.head?.data).toEqual(wordToken1);
    expect(linkedList.tail?.data).toEqual(wordToken3);
  });

  it('should print the word list of LinkedList', () => {
    linkedList.add(wordToken1);
    linkedList.add(wordToken2);
    linkedList.add(wordToken3);

    const EXPECTED_TEXT = 'Hello World !';
    const result = linkedList.printDataList((data) => data.word);
    expect(result).toBe(EXPECTED_TEXT);
  });

  it('should convert LinkedList instance to JSON', () => {
    linkedList.add(wordToken1);
    linkedList.add(wordToken2);
    linkedList.add(wordToken3);

    const EXPECTED_JSON = [
      {
        Word: 'Hello',
        Confidence: 0.9,
        StartTime: 0,
        EndTime: 1,
        Speaker: 1,
      },
      {
        Word: 'World',
        Confidence: 0.8,
        StartTime: 2,
        EndTime: 3,
        Speaker: 1,
      },
      {
        Word: '!',
        Confidence: 0.7,
        StartTime: 4,
        EndTime: 5,
        Speaker: 1,
      },
    ];
    const json = linkedList.toJSON((data: WordToken) => data.getExport());

    expect(json).toEqual(JSON.stringify(EXPECTED_JSON));
  });
});
