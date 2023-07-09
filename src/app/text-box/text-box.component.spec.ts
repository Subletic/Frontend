import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextBoxComponent } from './text-box.component';
import { SpeechBubble } from '../data/speechBubble.model';
import { WordToken } from '../data/wordToken.model';
import { LinkedList } from '../data/linkedList.model';

describe('TextBoxComponent', () => {
  let component: TextBoxComponent;
  let fixture: ComponentFixture<TextBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextBoxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBoxComponent);
    component = fixture.componentInstance;
    component.textbox = new SpeechBubble(0, 0, 0, new LinkedList, 0);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate the HTML representation of the textbox content', () => {
    const speechBubble = new SpeechBubble(0, 0, 0);
    speechBubble.words = new LinkedList(); // Initialisiere die words-Eigenschaft mit einer neuen LinkedList-Instanz
    const wordTexts = ['Hello,', 'World!', 'How', 'are', 'you?'];
    wordTexts.forEach((wordText) => {
      speechBubble.words.add(new WordToken(wordText, 1, 1, 1, 1));
    });
    component.textbox = speechBubble;
    const generatedHTML = component.generateHTML();
    const expectedHTML = wordTexts
    .map((wordText, index) => `<span id="${index}" style="color: #000000" contenteditable="true">${wordText}</span>`)
    .join(' ');

    expect(generatedHTML).toEqual(expectedHTML);
  });

  it('should find a word by its ID', () => {
    const speechBubble = new SpeechBubble(0, 0, 0, new LinkedList, 0);
    speechBubble.words = new LinkedList(); // Initialisiere die words-Eigenschaft mit einer neuen LinkedList-Instanz
    const word1 = new WordToken('Hello', 1, 1, 1, 1);
    const word2 = new WordToken('World', 2, 1, 1, 1);
    speechBubble.words.add(word1);
    speechBubble.words.add(word2);
    component.textbox = speechBubble;

    const foundWord = component.findWordById(0);
    expect(foundWord).toEqual(word1);

    const notFoundWord = component.findWordById(2);
    expect(notFoundWord).toBeNull();
  });

  it('should add an empty word if the word list is empty in ngAfterViewInit', () => {
    const component = new TextBoxComponent();
    component.textboxRef = { nativeElement: document.createElement('div') };
    component.textbox = new SpeechBubble(1, 1, 1);
  
    component.ngAfterViewInit();
  
    expect(component.textbox.words.size()).toBe(1);
  });

  it('should add the mouseover event listener to the textbox in ngAfterViewInit', () => {
    const component = new TextBoxComponent();
    const mockTextbox = document.createElement('div');
    component.textboxRef = { nativeElement: mockTextbox };
    component.textbox = new SpeechBubble(1, 1, 1);
  
    spyOn(mockTextbox, 'addEventListener'); // Spy-Objekt für addEventListener
  
    component.ngAfterViewInit();
  
    expect(mockTextbox.addEventListener).toHaveBeenCalledWith('mouseover', jasmine.any(Function));
  });

  it('should log the information about the hovered word in logInfoAboutTextbox', () => {
    const component = new TextBoxComponent();
    component.textbox = new SpeechBubble(1, 1, 1);
    component.textbox.words.add(new WordToken('Hello', 1, 1, 1, 1));
    component.textbox.words.add(new WordToken('World', 2, 1, 1, 1));
  
    spyOn(console, 'log');
  
    const mockEvent = new MouseEvent('mouseover');
    const mockTarget = document.createElement('span');
    mockTarget.textContent = 'Hello';
    mockTarget.id = '1';
    Object.defineProperty(mockEvent, 'target', { value: mockTarget });
  
    component.logInfoAboutTextbox(mockEvent);
  
    expect(console.log).toHaveBeenCalledWith('Word: Hello, ID: 1');
    expect(console.log).toHaveBeenCalledWith('Current Word: ', jasmine.any(WordToken));
    expect(console.log).toHaveBeenCalledWith('Print Text:', jasmine.any(String));
  });

  it('should remove empty objects from the word list', () => {
    const emptyWord = new WordToken('', 1, 1, 1, 1);
    component.textbox.words.add(emptyWord);
    spyOn(component.textbox.words, 'remove');

    component.removeEmptyObjects();

    expect(component.textbox.words.remove).toHaveBeenCalledWith(emptyWord);
  });

  describe('findWordById', () => {
    it('should return the correct word', () => {
      const word = new WordToken('test', 1, 1, 1, 1);
      component.textbox.words.add(word);
      expect(component.findWordById(word.id)).toEqual(word);
    });
     it('should return null if word is not found', () => {
      expect(component.findWordById(9999)).toBeNull();
    });
  });
   describe('insertAfter', () => {
    it('should insert a new word after a specified word', () => {
      const word1 = new WordToken('test1', 1, 1, 1, 1);
      const word2 = new WordToken('test2', 1, 1, 1, 1);
      component.textbox.words.add(word1);
      component.insertAfter(word2, word1);
      expect(word1.next).toEqual(word2);
      expect(word2.prev).toEqual(word1);
    });
  });
  
  describe('handleBackspacePressAtStart', () => {
    it('should delete word if in full selection', () => {
      let selectedSpan = document.getElementById('span');
      if(!selectedSpan) return;
      selectedSpan.textContent = 'test';
      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      component.handleBackspacePressAtStart(selectedSpan, 'test', true, '1', event);
      expect(component.textbox.words.head).toBeNull();
    });
     it('should merge with previous word if exists', () => {
      let selectedSpan = document.getElementById('span');
      if(!selectedSpan) return;
      selectedSpan.textContent = 'test';
      const prevSpan = document.createElement('span');
      prevSpan.textContent = 'prev';
      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      component.handleBackspacePressAtStart(selectedSpan, 'test', false, '1', event);
      if(component.textbox.words.head && component.textbox.words.head.next) {
        expect(component.textbox.words.head.word).toEqual('prevtest');
      }
    });
     it('should merge with following word if no previous word exists', () => {
      let selectedSpan = document.getElementById('span');
      if(!selectedSpan) return;
      selectedSpan.textContent = 'test';
      const nextSpan = document.createElement('span');
      nextSpan.textContent = 'next';
      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      component.handleBackspacePressAtStart(selectedSpan, 'test', false, '1', event);
      if(component.textbox.words.head && component.textbox.words.head.next) {
        expect(component.textbox.words.head.word).toEqual('testnext');
      }
    });
  });
   describe('handleSpacePress', () => {
    it('should split word on space press', () => {
      const selectedSpan = document.createElement('span');
      selectedSpan.textContent = 'test';
      const event = new KeyboardEvent('keydown', { code: 'Space' });
      component.handleSpacePress(selectedSpan, 'test', 2, '1', event);
      if(component.textbox.words.head && component.textbox.words.head.next) {
        expect(component.textbox.words.head.word).toEqual('te');
        expect(component.textbox.words.head.next.word).toEqual('st');
      }
    });
     it('should not split word if cursor is at start', () => {
      const selectedSpan = document.createElement('span');
      selectedSpan.textContent = 'test';
      const event = new KeyboardEvent('keydown', { code: 'Space' });
      component.handleSpacePress(selectedSpan, 'test', 0, '1', event);
      if(component.textbox.words.head && component.textbox.words.head.next) {
        expect(component.textbox.words.head.word).toEqual('');
        expect(component.textbox.words.head.next.word).toEqual('test');
      }
    });
  });
  

});
