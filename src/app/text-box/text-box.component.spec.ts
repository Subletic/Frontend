import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextBoxComponent } from './text-box.component';
import { SpeechBubble } from '../data/speechBubble.model';
import { WordToken } from '../data/wordToken.model';


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
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate the HTML representation of the textbox content', () => {
    const speechBubble = new SpeechBubble(0, 0);
    const wordTexts = ['Hello,', 'World!', 'How', 'are', 'you?'];
    wordTexts.forEach((wordText) => {
      speechBubble.words.add(new WordToken(wordText, 1, 1, 1, 1));
    });
    component.textbox = speechBubble;
    const generatedHTML = component.generateHTML();
    const expectedHTML = wordTexts
      .map((wordText, index) => `<span id="${index}" contenteditable="true">${wordText}</span>`)
      .join(' ');
    expect(generatedHTML).toEqual(expectedHTML);
  });

  it('should find a word by its ID', () => {
    const speechBubble = new SpeechBubble(0, 0);
    const word1 = new WordToken('Hello', 1, 1, 1, 1);
    const word2 = new WordToken('World', 2, 1, 1, 1);
    speechBubble.words.add(word1);
    speechBubble.words.add(word2);
    component.textbox = speechBubble;

    const foundWord = component.findWordById(1);
    expect(foundWord).toEqual(word1);

    const notFoundWord = component.findWordById(3);
    expect(notFoundWord).toBeNull();
  });

  
  
});
