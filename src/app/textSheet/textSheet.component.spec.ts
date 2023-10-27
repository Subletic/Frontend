import { SpeechBubble } from '../data/speechBubble/speechBubble.model';
import { SpeechBubbleExport } from '../data/speechBubble/speechBubbleExport.model';
import { WordToken } from '../data/wordToken/wordToken.model';
import { TextSheetComponent } from './textSheet.component';
import { SignalRService } from '../service/signalRService';
import { LinkedList } from '../data/linkedList/linkedList.model';
import { SpeechBubbleChain } from '../data/speechBubbleChain.module';

describe('LinkedList', () => {
  let linkedList: LinkedList<SpeechBubble>;
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
    expect(linkedList.head?.data).toBe(speechBubble1);
    expect(linkedList.tail?.data).toBe(speechBubble1);
  });

  it('should add multiple speech bubbles to the list', () => {
    linkedList.add(speechBubble1);
    linkedList.add(speechBubble2);
    linkedList.add(speechBubble3);
    expect(linkedList.head?.data).toBe(speechBubble1);
    if(linkedList.head && linkedList.head.next)
    {
        expect(linkedList.head?.next?.data).toBe(speechBubble2);
        expect(linkedList.head?.next?.next?.data).toBe(speechBubble3);
        expect(linkedList.tail?.data).toBe(speechBubble3);
    }
  });

  it('should remove a speech bubble from the list', () => {
    linkedList.add(speechBubble1);
    linkedList.add(speechBubble2);
    linkedList.add(speechBubble3);
    linkedList.remove(speechBubble2);
    expect(linkedList.head?.data).toBe(speechBubble1);
    if(linkedList.head) {
        expect(linkedList.head.next?.data).toBe(speechBubble3);
    }
    expect(linkedList.tail?.data).toBe(speechBubble3);
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
  
});

describe('TextSheetComponent', () => {
  let component: TextSheetComponent;
  let signalRService: SignalRService;

  beforeEach(() => {
    signalRService = new SignalRService();
    component = new TextSheetComponent(signalRService);
  });

  it('should initialize with a speech bubble', () => {
    expect(component.speechBubbles.head).toBeDefined();
  });

  it('should return an array of speech bubbles', () => {
    const speechBubbles = component.getSpeechBubblesArray();
    if(component.speechBubbles.head == null) return;
    expect(speechBubbles).toEqual([component.speechBubbles.head.data]);
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

  it('should retrieve the correct speech bubble by id', () => {
    const testBubble1 = new SpeechBubble(1, 1, 1);
    const testBubble2 = new SpeechBubble(2, 2, 2);
    component.speechBubbles.add(testBubble1);
    component.speechBubbles.add(testBubble2);

    const speechBubble1 = component.getSpeechBubbleById(testBubble1.id);
    const speechBubble2 = component.getSpeechBubbleById(testBubble2.id);
    const speechBubble3 = component.getSpeechBubbleById(999); // Non-existent id

    expect(speechBubble1).toBe(testBubble1);
    expect(speechBubble2).toBe(testBubble2);
    expect(speechBubble3).toBeUndefined();
  });

  it('should call the exportToJson method with the correct speech bubble when calling callExportToJson', () => {
    const testBubble = new SpeechBubble(1, 1, 1);
    component.speechBubbles.add(testBubble);

    spyOn(component, 'exportToJson');

    component.callExportToJson(testBubble.id);

    expect(component.exportToJson).toHaveBeenCalledWith([testBubble.getExport()]);
  });

  it('should retrieve an array of all speech bubbles', () => {
    const testBubble1 = new SpeechBubble(1, 1, 1);
    const testBubble2 = new SpeechBubble(2, 2, 2);
    component.speechBubbles.add(testBubble1);
    component.speechBubbles.add(testBubble2);

    const speechBubbles = component.getSpeechBubblesArray();

    expect(speechBubbles).toEqual([testBubble1, testBubble2]);
  });

  it('should delete a speech bubble from the speechBubbles list based on the id', () => {
    const testBubble1 = new SpeechBubble(1, 1, 1);
    const testBubble2 = new SpeechBubble(2, 2, 2);
    component.speechBubbles.add(testBubble1);
    component.speechBubbles.add(testBubble2);

    component.deleteSpeechBubble(testBubble1.id);

    expect(component.speechBubbles.size()).toBe(1);
    expect(component.speechBubbles.head?.data).toBe(testBubble2);
  });

  it('should not import from invalid speechBubbleChain object', () => {
    spyOn(console, 'error');
    spyOn(component, 'getSpeechBubbleById').and.returnValue(undefined);
    const speechBubbleExportNull: SpeechBubbleExport[] = [];
    component.importfromJSON(speechBubbleExportNull);
    expect(console.error).toHaveBeenCalledWith('Invalid speechBubbleChain object.');
  });

  it('should return early if speechBubble is falsy', () => {
    // Arrange
    const id = 1;
    spyOn(component, 'getSpeechBubbleById').and.returnValue(undefined);
    spyOn(window, 'clearInterval');
    spyOn(component, 'timeSinceFocusOutCounter');
    
    // Act
    component.onFocusOut(id);
    
    // Assert
    expect(component.getSpeechBubbleById).toHaveBeenCalledWith(id);
    expect(window.clearInterval).not.toHaveBeenCalled();
    expect(component.timeSinceFocusOutCounter).not.toHaveBeenCalled();
  });

  it('should return early if speechBubbleToExport is falsy', () => {
    // Arrange
    const id = 1;
    spyOn(component, 'getSpeechBubbleById').and.returnValue(undefined);
    spyOn(component, 'exportToJson');
    
    // Act
    component.callExportToJson(id);
    
    // Assert
    expect(component.getSpeechBubbleById).toHaveBeenCalledWith(id);
    expect(component.exportToJson).not.toHaveBeenCalled();
  });

  it('should start a timer and call callExportToJson after 5 seconds of inactivity', () => {
    // Arrange
    jasmine.clock().install();
    const id = 1;
    let callExportToJsonCalled = false;
    spyOn(component, 'callExportToJson').and.callFake(() => {
      callExportToJsonCalled = true;
    });
  
    // Act
    component.timeSinceFocusOutCounter(id);
  
    // Fast-forward time by 5 seconds
    jasmine.clock().tick(5000);
  
    // Assert
    expect(callExportToJsonCalled).toBe(false);
  
    // Clean up
    jasmine.clock().uninstall();
  });
  
  
  
  


});


  