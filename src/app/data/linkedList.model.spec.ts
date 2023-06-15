import { LinkedList } from './linkedList.model';
import { WordToken } from './wordToken.model';

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
  