import { WordToken, WordExport } from './wordToken.model';
import { SpeechBubbleExport, SpeechBubble } from './speechBubble.model';
import { LinkedList } from './linkedList.model';

describe('SpeechBubbleExport', () => {
  let wordExport1: WordExport;
  let wordExport2: WordExport;
  let speechBubbleExport: SpeechBubbleExport;

  beforeEach(() => {
    wordExport1 = new WordExport('Hello', 0.9, 0, 1, 1);
    wordExport2 = new WordExport('World', 0.8, 2, 3, 1);
    speechBubbleExport = new SpeechBubbleExport(1, 1, 0, 3, [wordExport1, wordExport2]);
  });

  it('should correctly initialize SpeechBubbleExport instance', () => {
    expect(speechBubbleExport.id).toBe(1);
    expect(speechBubbleExport.speaker).toBe(1);
    expect(speechBubbleExport.startTime).toBe(0);
    expect(speechBubbleExport.endTime).toBe(3);
    expect(speechBubbleExport.speechBubbleContent.length).toBe(2);
    expect(speechBubbleExport.speechBubbleContent[0]).toEqual(wordExport1);
    expect(speechBubbleExport.speechBubbleContent[1]).toEqual(wordExport2);
  });

  it('should convert SpeechBubbleExport instance to JSON', () => {
    const expectedJson = {
      Id: 1,
      Speaker: 1,
      StartTime: 0,
      EndTime: 3,
      SpeechBubbleContent: [
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
        }
      ]
    };

    expect(speechBubbleExport.toJSON()).toEqual(expectedJson);
  });
});

describe('SpeechBubble', () => {
  let speechBubble: SpeechBubble;
  let wordToken1: WordToken;
  let wordToken2: WordToken;

  beforeEach(() => {
    speechBubble = new SpeechBubble(1, 0, 3, new LinkedList, 1);
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
    expect(speechBubble.words.head).toEqual(wordToken1);
    expect(speechBubble.words.tail).toEqual(wordToken2);
  });

  it('should remove WordToken from SpeechBubble', () => {
    speechBubble.words.add(wordToken1);
    speechBubble.words.add(wordToken2);

    speechBubble.words.remove(wordToken1);

    expect(speechBubble.words.size()).toBe(1);
    expect(speechBubble.words.head).toEqual(wordToken2);
    expect(speechBubble.words.tail).toEqual(wordToken2);
  });

  it('should print the text of SpeechBubble', () => {
    speechBubble.words.add(wordToken1);
    speechBubble.words.add(wordToken2);

    const expectedText = '[Hello, World]';
    expect(speechBubble.printText()).toBe(expectedText);
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
    expect(speechBubbleExport.speechBubbleContent[0]).toEqual(wordToken1.getExport());
    expect(speechBubbleExport.speechBubbleContent[1]).toEqual(wordToken2.getExport());
  });
});

describe('LinkedList', () => {
  let linkedList: LinkedList;
  let wordToken1: WordToken;
  let wordToken2: WordToken;
  let wordToken3: WordToken;

  beforeEach(() => {
    linkedList = new LinkedList();
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

    expect(linkedList.head).toEqual(wordToken1);
    expect(linkedList.tail).toEqual(wordToken2);
    expect(linkedList.size()).toBe(2);
  });

  it('should remove WordToken from LinkedList', () => {
    linkedList.add(wordToken1);
    linkedList.add(wordToken2);
    linkedList.add(wordToken3);

    linkedList.remove(wordToken2);

    expect(linkedList.head).toEqual(wordToken1);
    expect(linkedList.tail).toEqual(wordToken3);
    expect(linkedList.size()).toBe(2);
  });

  it('should print the word list of LinkedList', () => {
    linkedList.add(wordToken1);
    linkedList.add(wordToken2);
    linkedList.add(wordToken3);

    const expectedText = 'Hello World !';
    expect(linkedList.printWordList()).toBe(expectedText);
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

    expect(linkedList.toJSON()).toEqual(JSON.stringify(expectedJson));
  });
});
