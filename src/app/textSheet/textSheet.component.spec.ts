import { SpeechBubble, SpeechBubbleExport } from '../data/speechBubble.model';
import { WordToken } from '../data/wordToken.model';
import { LinkedList, TextSheetComponent, SpeechBubbleChain } from './textSheet.component';
import { SignalRService } from '../service/signalRService';

describe('LinkedList', () => {
  let linkedList: LinkedList;
  let speechBubble1: SpeechBubble;
  let speechBubble2: SpeechBubble;
  let speechBubble3: SpeechBubble;

  beforeEach(() => {
    linkedList = new LinkedList();
    speechBubble1 = new SpeechBubble(0, 0, 0);
    speechBubble2 = new SpeechBubble(1, 1, 1);
    speechBubble3 = new SpeechBubble(2, 2, 2);
  });

  it('should add a speech bubble to the list', () => {
    linkedList.add(speechBubble1);
    expect(linkedList.head).toBe(speechBubble1);
    expect(linkedList.tail).toBe(speechBubble1);
  });

  it('should add multiple speech bubbles to the list', () => {
    linkedList.add(speechBubble1);
    linkedList.add(speechBubble2);
    linkedList.add(speechBubble3);
    expect(linkedList.head).toBe(speechBubble1);
    if(linkedList.head && linkedList.head.next)
    {
        expect(linkedList.head.next).toBe(speechBubble2);
        expect(linkedList.head.next.next).toBe(speechBubble3);
        expect(linkedList.tail).toBe(speechBubble3);
    }
  });

  it('should remove a speech bubble from the list', () => {
    linkedList.add(speechBubble1);
    linkedList.add(speechBubble2);
    linkedList.add(speechBubble3);
    linkedList.remove(speechBubble2);
    expect(linkedList.head).toBe(speechBubble1);
    if(linkedList.head) {
        expect(linkedList.head.next).toBe(speechBubble3);
    }
    expect(linkedList.tail).toBe(speechBubble3);
  });



  it('should export speech bubbles to JSON', () => {
    const testBubble1 = new SpeechBubble(0, 0, 0);
    const word = new WordToken('Testeingabe', 1, 1, 1, 1);
    const word2 = new WordToken('weitere', 1, 1, 1, 1);
    testBubble1.words.add(word);
    testBubble1.words.add(word2);
    const speechBubbleExport1 = testBubble1.getExport();
    const speechBubbleChain = new SpeechBubbleChain([speechBubbleExport1]);
    const expectedJson = {
      SpeechbubbleChain: [speechBubbleExport1.toJSON()],
    };
    expect(speechBubbleChain.toJSON()).toEqual(expectedJson);
  });

  it('should retain correct format after conversion to JSON and back', () => {
    const component = new TextSheetComponent(new SignalRService);
    const testBubble1 = new SpeechBubble(1, 1, 1);
    component.speechBubbles.add(testBubble1);
  
    const speechBubbleExport = testBubble1.getExport();
    const speechBubbleChain = new SpeechBubbleChain([speechBubbleExport]);
  
    const jsonString = JSON.stringify(speechBubbleChain);
    const parsedSpeechBubbleChain = JSON.parse(jsonString) as SpeechBubbleChain;
  
    const parsedSpeechBubbleExport = parsedSpeechBubbleChain.SpeechbubbleChain[0] as SpeechBubbleExport;
  
    expect(parsedSpeechBubbleExport).toEqual(jasmine.objectContaining(speechBubbleExport));
  });
  
});

describe('TextSheetComponent', () => {
  let component: TextSheetComponent;

  beforeEach(() => {
    component = new TextSheetComponent(new SignalRService);
  });

  it('should initialize with a speech bubble', () => {
    expect(component.speechBubbles.head).toBeDefined();
  });

  it('should add a new standard speech bubble', () => {
    const initialLength = component.getSpeechBubblesArray().length;
    component.addNewStandardSpeechBubble();
    const speechBubbles = component.getSpeechBubblesArray();
    expect(speechBubbles.length).toBe(initialLength + 1);
  });

  it('should return an array of speech bubbles', () => {
    const speechBubbles = component.getSpeechBubblesArray();
    if(component.speechBubbles.head == null) return;
    expect(speechBubbles).toEqual([component.speechBubbles.head]);
  });

  it('should add a new standard speech bubble', () => {
    const initialLength = component.getSpeechBubblesArray().length;
    component.addNewStandardSpeechBubble();
    const speechBubbles = component.getSpeechBubblesArray();
    expect(speechBubbles.length).toBe(initialLength + 1);
  });

  it('should remove a speech bubble', () => {
    const initialLength = component.getSpeechBubblesArray().length;

    
    const newSpeechBubble = new SpeechBubble(0, 0, 0);
    component.speechBubbles.add(newSpeechBubble);

    component.deleteSpeechBubble(newSpeechBubble.id);

    const speechBubbles = component.getSpeechBubblesArray();
    expect(speechBubbles.length).toBe(initialLength);
    expect(speechBubbles).not.toContain(newSpeechBubble);
  });

});



    
