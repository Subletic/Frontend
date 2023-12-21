import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeechbubbleComponent } from './speechbubble.component';
import { SpeechBubble } from '../../data/speechBubble/speechBubble.model';
import { WordToken } from '../../data/wordToken/wordToken.model';
import { LinkedList } from '../../data/linkedList/linkedList.model';
import { ChangeDetectorRef } from '@angular/core';
import { WordComponent } from './word/word.component';

describe('SpeechbubbleComponent', () => {
  let component: SpeechbubbleComponent;
  let fixture: ComponentFixture<SpeechbubbleComponent>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpeechbubbleComponent, WordComponent],
      providers: [ChangeDetectorRef],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechbubbleComponent);
    component = fixture.componentInstance;
    component.speechBubble = new SpeechBubble(0, 0, 0, new LinkedList(), 0);
    fixture.detectChanges();
  });

  it('should create SpeechbubbleComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize speechBubble property', () => {
    expect(component.speechBubble).toBeDefined();
  });

  it('should remove empty objects when removeEmptyObjects is called', () => {
    component.speechBubble.words.add(new WordToken('', 1, 1, 1, 1));
    component.removeEmptyObjects();
    expect(component.speechBubble.words.size()).toBe(0);
  });

  it('should find a word by its ID', () => {
    const speechBubble = new SpeechBubble(
      0,
      0,
      0,
      new LinkedList<WordToken>(),
      0,
    );
    speechBubble.words = new LinkedList<WordToken>();
    const WORD_1 = new WordToken('Hello', 1, 1, 1, 1);
    const WORD_2 = new WordToken('World', 2, 1, 1, 1);
    speechBubble.words.add(WORD_1);
    speechBubble.words.add(WORD_2);
    component.speechBubble = speechBubble;

    const FOUND_WORD = component.speechBubble.words.getDataById(0);
    expect(FOUND_WORD).toEqual(WORD_1);

    const NOT_FOUND_WORD = component.speechBubble.words.getDataById(2);
    expect(NOT_FOUND_WORD).toBeNull();
  });

  it('should update word highlight styles based on FontWeight', () => {
    // Create a mock data structure with sample fontWeight values
    const words = new LinkedList<WordToken>();
    words.add(new WordToken('Hello', 0.9, 1, 2, 1));
    words.add(new WordToken('world,', 0.8, 2, 4, 1));
    words.add(new WordToken('how', 0.7, 4, 6, 1));
    words.add(new WordToken('are', 0.6, 6, 8, 1));
    words.add(new WordToken('you?', 0.5, 8, 10, 1));

    const SPEECHBUBBLE = new SpeechBubble(1, 0, 10, words, 0);

    component.speechBubble = SPEECHBUBBLE;
    fixture.detectChanges();

    if (component.speechBubble.words.head?.next) {
      component.speechBubble.words.head.next.data.fontWeight = 'bold';
    }

    const mockSpan1 = document.createElement('span');
    mockSpan1.id = '0_0';
    mockSpan1.style.fontWeight = 'normal';

    const mockSpan2 = document.createElement('span');
    mockSpan2.id = '0_1';
    mockSpan2.style.fontWeight = 'normal';

    component.textboxRef.nativeElement.appendChild(mockSpan1);
    component.textboxRef.nativeElement.appendChild(mockSpan2);

    component.updateWordHighlight();

    expect(mockSpan1.style.fontWeight).toBe('normal');

    expect(mockSpan2.style.fontWeight).toBe('bold');
  });

  // ab hier neu

  it('should logInfoAboutTextbox on mousevent', () => {
    spyOn(component, 'logInfoAboutTextbox');

    const MOUSE_EVENT = new MouseEvent('mouseover');
    component.textboxRef.nativeElement.dispatchEvent(MOUSE_EVENT);

    expect(component.logInfoAboutTextbox).toHaveBeenCalledWith(MOUSE_EVENT);
  });

  it('should detectChanges on keyup', () => {
    spyOn(component.cdr, 'detectChanges');

    const KEYUP_EVENT = new KeyboardEvent('keyup', { key: 't' });
    component.textboxRef.nativeElement.dispatchEvent(KEYUP_EVENT);

    expect(component.cdr.detectChanges).toHaveBeenCalledWith();
  });

  it('should return an array of WordToken nodes', () => {
    const word1 = new WordToken('Hello', 1, 1, 1, 1);
    const word2 = new WordToken('World', 1, 1, 1, 1);

    component.speechBubble.words.add(word1);
    component.speechBubble.words.add(word2);

    const wordsArray = component.getWordsArray();
    expect(wordsArray.length).toBe(3);

    // Eine Stelle weiter, weil das erste Wort ein leeres ist
    expect(wordsArray[1].data).toEqual(word1);
    expect(wordsArray[2].data).toEqual(word2);
  });

  it('should update the word data when onWordUpdate is called', () => {
    const originalWord = new WordToken('Hello', 1, 1, 1, 1);
    component.speechBubble.words.add(originalWord);

    const updatedWord = new WordToken('Hellop', 1, 1, 1, 1);
    component.onWordUpdate(updatedWord, 1);

    if (!component.speechBubble.words.head) return;
    const updatedWordCopy = component.speechBubble.words.head.next;
    if (updatedWordCopy) expect(updatedWordCopy.data).toEqual(updatedWord);
  });

  it('should not update any word when onWordUpdate is called with an invalid ID', () => {
    spyOn(component.cdr, 'detectChanges');
    const originalWord = new WordToken('Hello', 1, 1, 1, 1);
    component.speechBubble.words.add(originalWord);

    const updatedWord = new WordToken('Hellop', 1, 1, 1, 1);
    component.onWordUpdate(updatedWord, 2);

    expect(component.cdr.detectChanges).not.toHaveBeenCalledWith();
  });

  it('should remove the word when onDeleteSelfCall is called with a valid ID', () => {
    spyOn(component.cdr, 'detectChanges');
    const originalWord = new WordToken('Hello', 1, 1, 1, 1);
    component.speechBubble.words.add(originalWord);

    component.onDeleteSelfCall(1);

    expect(component.speechBubble.words.head).not.toBeNull();
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });

  it('should not remove any word when onDeleteSelfCall is called with an invalid ID', () => {
    spyOn(component.cdr, 'detectChanges');
    const originalWord = new WordToken('Hello', 1, 1, 1, 1);
    component.speechBubble.words.add(originalWord);

    component.onDeleteSelfCall(2);

    expect(component.speechBubble.words.head).not.toBeNull();
    expect(component.cdr.detectChanges).not.toHaveBeenCalled();
  });

  it('should add a new word after the emitter when newWordAfter is called', () => {
    spyOn(component.cdr, 'detectChanges');
    const originalWord = new WordToken('Hello', 1, 1, 1, 1);
    component.speechBubble.words.add(originalWord);

    component.newWordAfter('World', 1);

    if (
      !component.speechBubble.words.head ||
      !component.speechBubble.words.head.next ||
      !component.speechBubble.words.head.next.next
    )
      return;
    const newWordAfter = component.speechBubble.words.head.next.next.data;

    expect(newWordAfter.word).toBe('World');
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });

  it('should not add a new word when newWordAfter is called with an invalid ID', () => {
    spyOn(component.cdr, 'detectChanges');
    const originalWord = new WordToken('Hello', 1, 1, 1, 1);
    component.speechBubble.words.add(originalWord);

    component.newWordAfter('World', 2);

    expect(component.speechBubble.words.head).not.toBeNull();
    expect(component.cdr.detectChanges).not.toHaveBeenCalled();
  });

  it('should combine words when combineWords is called with a valid ID', () => {
    const word1 = new WordToken('Hello', 1, 1, 1, 1);
    const word2 = new WordToken('World', 1, 1, 1, 1);
    component.speechBubble.words.add(word1);
    component.speechBubble.words.add(word2);

    component.combineWords(2);

    if (
      !component.speechBubble.words.head ||
      !component.speechBubble.words.head.next
    )
      return;
    const combinedWord = component.speechBubble.words.head.next.data;

    expect(combinedWord.word).toBe('HelloWorld');
  });

  it('should not combine words when combineWords is called with an invalid ID', () => {
    spyOn(component.cdr, 'detectChanges');
    const word1 = new WordToken('Hello', 1, 1, 1, 1);
    const word2 = new WordToken('World', 1, 1, 1, 1);
    component.speechBubble.words.add(word1);
    component.speechBubble.words.add(word2);

    component.combineWords(3);

    if (
      !component.speechBubble.words.head ||
      !component.speechBubble.words.head.next
    )
      return;
    const wordAfterCombine = component.speechBubble.words.head.next.data;

    expect(wordAfterCombine.word).toBe('Hello');
    expect(component.cdr.detectChanges).not.toHaveBeenCalled();
  });

  it('should not combine words when combineWords is called with emitter being the head', () => {
    spyOn(component.cdr, 'detectChanges');
    const HEAD = component.speechBubble.words.head;
    component.combineWords(0);
    expect(component.speechBubble.words.head).toBe(HEAD);
  });

  it('should focus on the span when focusSpan is called', () => {
    const word1 = new WordToken('Hello', 1, 1, 1, 1);
    component.speechBubble.words.add(word1);
    component.cdr.detectChanges();

    const firstSpan = document.getElementById('0_1');
    if (!firstSpan) return;

    if (component.speechBubble.words.head) component.focusSpan(word1);

    const focusedElement = document.activeElement?.id;

    expect(focusedElement).toEqual(firstSpan.id);
  });

  // Dieser Test muss überarbeitet werden: Er erkennt die Funktionen auf window.getSelection() nicht
  /*
  it('should set the cursor position within a span element', async () => {
    const word = new WordToken('Test', 1, 1, 1, 1);
    component.speechBubble.words.add(word);

    //await fixture.whenStable();
    setTimeout(() => {
      if (!component.speechBubble.words.head || !component.speechBubble.words.head.next) return;
      const spanId = `${component.speechBubble.id}_${component.speechBubble.words.head.next.id}`;
      const span = document.getElementById(spanId);

      setTimeout(() => {
        component.setCursorPosition(word, 2);
      }, 2);

      const textNode = span?.firstChild;
      const selection = window.getSelection();

      expect(span?.textContent).toEqual('Test');
      expect(selection?.anchorNode).toEqual(textNode);

    }, 2);
  });
  */

  // wieder ältere Tests aus text-box
  it('should log the information about the hovered word in logInfoAboutTextbox', () => {
    const component = new SpeechbubbleComponent(cdr);
    component.speechBubble = new SpeechBubble(
      1,
      1,
      1,
      new LinkedList<WordToken>(),
      0,
    );
    component.speechBubble.words.add(new WordToken('Hello', 1, 1, 1, 1));
    component.speechBubble.words.add(new WordToken('World', 2, 1, 1, 1));

    spyOn(console, 'log');

    const MOCK_EVENT = new MouseEvent('mouseover');
    const mockTarget = document.createElement('span');
    mockTarget.textContent = 'Hello';
    mockTarget.id = '0_1';
    Object.defineProperty(MOCK_EVENT, 'target', { value: mockTarget });

    component.logInfoAboutTextbox(MOCK_EVENT);

    expect(console.log).toHaveBeenCalledWith('Word: Hello, ID: 1');
    expect(console.log).toHaveBeenCalledWith(
      'Current Word: ',
      jasmine.any(WordToken),
    );
    expect(console.log).toHaveBeenCalledWith(
      'Print Text:',
      jasmine.any(String),
    );
  });

  it('should remove empty objects from the word list', () => {
    const EMPTY_WORD = new WordToken('', 1, 1, 1, 1);
    component.speechBubble.words.add(EMPTY_WORD);
    spyOn(component.speechBubble.words, 'remove');

    component.removeEmptyObjects();

    expect(component.speechBubble.words.remove).toHaveBeenCalledWith(
      EMPTY_WORD,
    );
  });
});
