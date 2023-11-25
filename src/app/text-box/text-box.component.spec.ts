import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TextBoxComponent } from './text-box.component'
import { SpeechBubble } from '../data/speechBubble/speechBubble.model'
import { WordToken } from '../data/wordToken/wordToken.model'
import { LinkedList } from '../data/linkedList/linkedList.model'

describe('TextBoxComponent', () => {
    let component: TextBoxComponent
    let fixture: ComponentFixture<TextBoxComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TextBoxComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(TextBoxComponent)
        component = fixture.componentInstance
        component.textbox = new SpeechBubble(0, 0, 0, new LinkedList(), 0)
        fixture.detectChanges()
    })

    it('should create the component', () => {
        expect(component).toBeTruthy()
    })

    it('should generate the HTML representation of the textbox content', () => {
        const SPEECHBUBBLE = new SpeechBubble(0, 0, 0)
        SPEECHBUBBLE.words = new LinkedList()
        SPEECHBUBBLE.id = 0
        const wordTexts = ['Hello,', 'World!', 'How', 'are', 'you?']
        wordTexts.forEach((wordText) => {
            SPEECHBUBBLE.words.add(new WordToken(wordText, 1, 1, 1, 1))
        })
        component.textbox = SPEECHBUBBLE
        const GENERATED_HTML = component.generateHTML()
        const EXPECTED_HTML = wordTexts
            .map(
                (wordText, index) =>
                    `<span id="0_${index}" style="color: #000000; font-weight: normal" contenteditable="true">${wordText}</span>`,
            )
            .join(' ')

        expect(GENERATED_HTML).toEqual(EXPECTED_HTML)
    })

    it('should find a word by its ID', () => {
        const speechBubble = new SpeechBubble(
            0,
            0,
            0,
            new LinkedList<WordToken>(),
            0,
        )
        speechBubble.words = new LinkedList<WordToken>()
        const WORD_1 = new WordToken('Hello', 1, 1, 1, 1)
        const WORD_2 = new WordToken('World', 2, 1, 1, 1)
        speechBubble.words.add(WORD_1)
        speechBubble.words.add(WORD_2)
        component.textbox = speechBubble

        const FOUND_WORD = component.textbox.words.getDataById(0)
        expect(FOUND_WORD).toEqual(WORD_1)

        const NOT_FOUND_WORD = component.textbox.words.getDataById(2)
        expect(NOT_FOUND_WORD).toBeNull()
    })

    it('should add an empty word if the word list is empty in ngAfterViewInit', () => {
        const component = new TextBoxComponent()
        component.textboxContainerRef = {
            nativeElement: document.createElement('div'),
        }
        component.textboxRef = { nativeElement: document.createElement('div') }
        component.textbox = new SpeechBubble(
            1,
            1,
            1,
            new LinkedList<WordToken>(),
            0,
        )

        component.ngAfterViewInit()

        expect(component.textbox.words.size()).toBe(1)
    })

    it('should add the mouseover event listener to the textbox in ngAfterViewInit', () => {
        const component = new TextBoxComponent()
        component.textboxContainerRef = {
            nativeElement: document.createElement('div'),
        }
        const MOCK_TEXTBOX = document.createElement('div')
        component.textboxRef = { nativeElement: MOCK_TEXTBOX }
        component.textbox = new SpeechBubble(
            1,
            1,
            1,
            new LinkedList<WordToken>(),
            0,
        )

        spyOn(MOCK_TEXTBOX, 'addEventListener')

        component.ngAfterViewInit()

        expect(MOCK_TEXTBOX.addEventListener).toHaveBeenCalledWith(
            'mouseover',
            jasmine.any(Function),
        )
    })

    it('should log the information about the hovered word in logInfoAboutTextbox', () => {
        const component = new TextBoxComponent()
        component.textbox = new SpeechBubble(
            1,
            1,
            1,
            new LinkedList<WordToken>(),
            0,
        )
        component.textbox.words.add(new WordToken('Hello', 1, 1, 1, 1))
        component.textbox.words.add(new WordToken('World', 2, 1, 1, 1))

        spyOn(console, 'log')

        const MOCK_EVENT = new MouseEvent('mouseover')
        const mockTarget = document.createElement('span')
        mockTarget.textContent = 'Hello'
        mockTarget.id = '0_1'
        Object.defineProperty(MOCK_EVENT, 'target', { value: mockTarget })

        component.logInfoAboutTextbox(MOCK_EVENT)

        expect(console.log).toHaveBeenCalledWith('Word: Hello, ID: 1')
        expect(console.log).toHaveBeenCalledWith(
            'Current Word: ',
            jasmine.any(WordToken),
        )
        expect(console.log).toHaveBeenCalledWith(
            'Print Text:',
            jasmine.any(String),
        )
    })

    it('should remove empty objects from the word list', () => {
        const EMPTY_WORD = new WordToken('', 1, 1, 1, 1)
        component.textbox.words.add(EMPTY_WORD)
        spyOn(component.textbox.words, 'remove')

        component.removeEmptyObjects()

        expect(component.textbox.words.remove).toHaveBeenCalledWith(EMPTY_WORD)
    })

    describe('findWordById', () => {
        it('should return null if word is not found', () => {
            expect(component.textbox.words.getDataById(9999)).toBeNull()
        })
    })

    describe('handleBackspacePressAtStart', () => {
        it('should delete word if in full selection', () => {
            const selectedSpan = document.getElementById('span')
            if (!selectedSpan) return
            selectedSpan.textContent = 'test'
            const EVENT = new KeyboardEvent('keydown', { key: 'Backspace' })
            component.handleBackspacePressAtStart(
                selectedSpan,
                'test',
                true,
                '1',
                EVENT,
            )
            expect(component.textbox.words.head).toBeNull()
        })
        it('should merge with previous word if exists', () => {
            const selectedSpan = document.getElementById('span')
            if (!selectedSpan) return
            selectedSpan.textContent = 'test'
            const prevSpan = document.createElement('span')
            prevSpan.textContent = 'prev'
            const EVENT = new KeyboardEvent('keydown', { key: 'Backspace' })
            component.handleBackspacePressAtStart(
                selectedSpan,
                'test',
                false,
                '1',
                EVENT,
            )
            if (
                component.textbox.words.head &&
                component.textbox.words.head.next
            ) {
                expect(component.textbox.words.head.data.word).toEqual(
                    'prevtest',
                )
            }
        })
        it('should merge with following word if no previous word exists', () => {
            const selectedSpan = document.getElementById('span')
            if (!selectedSpan) return
            selectedSpan.textContent = 'test'
            const nextSpan = document.createElement('span')
            nextSpan.textContent = 'next'
            const EVENT = new KeyboardEvent('keydown', { key: 'Backspace' })
            component.handleBackspacePressAtStart(
                selectedSpan,
                'test',
                false,
                '1',
                EVENT,
            )
            if (
                component.textbox.words.head &&
                component.textbox.words.head.next
            ) {
                expect(component.textbox.words.head.data.word).toEqual(
                    'testnext',
                )
            }
        })
    })
    describe('handleSpacePress', () => {
        it('should split word on space press', () => {
            const selectedSpan = document.createElement('span')
            selectedSpan.textContent = 'test'
            const EVENT = new KeyboardEvent('keydown', { code: 'Space' })
            component.handleSpacePress(selectedSpan, 'test', 2, '1', EVENT)
            if (
                component.textbox.words.head &&
                component.textbox.words.head.next
            ) {
                expect(component.textbox.words.head.data.word).toEqual('te')
                expect(component.textbox.words.head.next.data.word).toEqual(
                    'st',
                )
            }
        })
        it('should not split word if cursor is at start', () => {
            const selectedSpan = document.createElement('span')
            selectedSpan.textContent = 'test'
            const EVENT = new KeyboardEvent('keydown', { code: 'Space' })
            component.handleSpacePress(selectedSpan, 'test', 0, '1', EVENT)
            if (
                component.textbox.words.head &&
                component.textbox.words.head.next
            ) {
                expect(component.textbox.words.head.data.word).toEqual('')
                expect(component.textbox.words.head.next.data.word).toEqual(
                    'test',
                )
            }
        })
    })

    describe('generateHTML', () => {
        it('should generate HTML representation of the textbox content', () => {
            component.textbox.words.add(new WordToken('test', 1, 1, 1, 1))
            const HTML = component.generateHTML()
            expect(HTML).toContain(
                '<span id="0_0" style="color: #000000; font-weight: normal" contenteditable="true"></span> <span id="0_1" style="color: #000000; font-weight: normal" contenteditable="true">test</span>',
            )
        })
    })

    it('should not add an empty word if textbox.words.head is null', () => {
        const textbox = component.textbox
        textbox.words.head = null
        spyOn(textbox.words, 'add')

        component.ngAfterViewInit()

        expect(textbox.words.add).toHaveBeenCalledWith(jasmine.any(Object))
    })

    it('should not handle space press if currentText or cursorPosition is null', () => {
        const SELECTED_SPAN = document.createElement('span')
        const CURRENT_TEXT = null
        const CURSOR_POSITION = 5
        const SPAN_ID = '123'
        const EVENT = new KeyboardEvent('keydown', { code: 'Space' })
        spyOn(component.textbox.words, 'getDataById')

        component.handleSpacePress(
            SELECTED_SPAN,
            CURRENT_TEXT,
            CURSOR_POSITION,
            SPAN_ID,
            EVENT,
        )

        expect(component.textbox.words.getDataById).not.toHaveBeenCalled()
    })
})

describe('TextBoxComponent', () => {
    let component: TextBoxComponent
    let selectedSpan: HTMLElement
    let currentText: string
    let prevSpan: HTMLSpanElement
    let event: KeyboardEvent

    beforeEach(() => {
        component = new TextBoxComponent()
        component.textbox = new SpeechBubble(
            1,
            1,
            1,
            new LinkedList<WordToken>(),
            0,
        )
        component.textbox.words = new LinkedList()
        selectedSpan = document.createElement('span')
        currentText = 'Word'
        prevSpan = document.createElement('span')
        event = new KeyboardEvent('keydown')
    })

    it('should merge with previous word when word is in full selection', () => {
        selectedSpan.textContent = currentText
        selectedSpan.id = '0_1'
        const CURRENT_WORD = new WordToken(currentText, 1, 1, 1, 1)
        const PREV_WORD = new WordToken('Previous', 1, 1, 1, 1)
        component.textbox.words.add(PREV_WORD)
        component.textbox.words.add(CURRENT_WORD)

        component.isInFullSelectionDeletion(selectedSpan, '0_1', event)

        expect(component.textbox.words.size()).toBe(1)
        expect(component.textbox.words.head?.data).toBe(PREV_WORD)
        expect(component.textbox.words.tail?.data).toBe(PREV_WORD)
        expect(prevSpan.getAttribute('id')).toBeNull()
        expect(selectedSpan.parentNode).toBeNull()
    })

    it('should merge with previous word when previous word exists', () => {
        selectedSpan.textContent = currentText
        selectedSpan.id = '2'
        const CURRENT_WORD = new WordToken(currentText, 1, 1, 1, 1)
        const PREV_WORD = new WordToken('Previous', 1, 1, 1, 1)
        component.textbox.words.add(PREV_WORD)
        component.textbox.words.add(CURRENT_WORD)
        spyOn(component.textbox.words, 'getDataById').and.returnValues(
            PREV_WORD,
            CURRENT_WORD,
        )

        component.mergeWithPreviousWord(
            selectedSpan,
            currentText,
            prevSpan,
            event,
        )

        expect(component.textbox.words.size()).toBe(2)
        expect(component.textbox.words.head?.data).toBe(PREV_WORD)
        expect(component.textbox.words.tail?.data).toBe(CURRENT_WORD)
        expect(prevSpan.getAttribute('id')).toBeNull()
        expect(event.defaultPrevented).toBeFalse()
    })
})

describe('TextBoxComponent', () => {
    let component: TextBoxComponent
    let fixture: ComponentFixture<TextBoxComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TextBoxComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(TextBoxComponent)
        component = fixture.componentInstance
        component.textbox = new SpeechBubble(0, 0, 0, new LinkedList(), 0)
        fixture.detectChanges()
    })

    it('should handle Space press', () => {
        const words = new LinkedList<WordToken>()
        words.add(new WordToken('Hello', 0.9, 1, 2, 1))
        words.add(new WordToken('world,', 0.8, 2, 4, 1))
        words.add(new WordToken('how', 0.7, 4, 6, 1))
        words.add(new WordToken('are', 0.6, 6, 8, 1))
        words.add(new WordToken('you?', 0.5, 8, 10, 1))

        const SPEECHBUBBLE = new SpeechBubble(1, 0, 10, words)

        component.textbox = SPEECHBUBBLE
        fixture.detectChanges()

        component.ngAfterViewInit()

        const EVENT = new KeyboardEvent('keydown', { key: ' ' })

        const SELECTED_SPAN = fixture.nativeElement.querySelector('span')
        const CURRENT_TEXT = 'Hello'
        const CURSOR_POSITION = 2
        const SPAN_ID = '0'

        component.handleSpacePress(
            SELECTED_SPAN,
            CURRENT_TEXT,
            CURSOR_POSITION,
            SPAN_ID,
            EVENT,
        )

        expect(SELECTED_SPAN.textContent).toBe('He')
    })

    it('should handle Space press with "" before', () => {
        const words = new LinkedList<WordToken>()
        words.add(new WordToken('Hello', 0.9, 1, 2, 1))
        words.add(new WordToken('world,', 0.8, 2, 4, 1))
        words.add(new WordToken('how', 0.7, 4, 6, 1))
        words.add(new WordToken('are', 0.6, 6, 8, 1))
        words.add(new WordToken('you?', 0.5, 8, 10, 1))

        const SPEECHBUBBLE = new SpeechBubble(1, 0, 10, words, 0)

        component.textbox = SPEECHBUBBLE
        fixture.detectChanges()

        component.ngAfterViewInit()

        const EVENT = new KeyboardEvent('keydown', { key: ' ' })

        const SELECTED_SPAN = fixture.nativeElement.querySelector('span')
        const CURRENT_TEXT = 'Hello'
        const CURSOR_POSITION = 0
        const SPAN_ID = '0_0'

        component.handleSpacePress(
            SELECTED_SPAN,
            CURRENT_TEXT,
            CURSOR_POSITION,
            SPAN_ID,
            EVENT,
        )

        expect(SELECTED_SPAN.textContent).toBe('Hello')
    })

    it('should handle full selection', () => {
        const words = new LinkedList<WordToken>()
        words.add(new WordToken('Hello', 0.9, 1, 2, 1))
        words.add(new WordToken('world,', 0.8, 2, 4, 1))
        words.add(new WordToken('how', 0.7, 4, 6, 1))
        words.add(new WordToken('are', 0.6, 6, 8, 1))
        words.add(new WordToken('you?', 0.5, 8, 10, 1))

        const SPEECHBUBBLE = new SpeechBubble(1, 0, 10, words, 0)

        component.textbox = SPEECHBUBBLE
        fixture.detectChanges()

        component.ngAfterViewInit()

        const EVENT = new KeyboardEvent('keydown', { key: ' ' })

        const SELECTED_SPAN = fixture.nativeElement.querySelector('span')
        const CURRENT_TEXT = 'Hello'
        const SPAN_ID = '0_0'

        component.handleBackspacePressAtStart(
            SELECTED_SPAN,
            CURRENT_TEXT,
            true,
            SPAN_ID,
            EVENT,
        )
        if (component.textbox.words.head) {
            expect(component.textbox.words.head.data.word).toBe('world,')
        }
    })

    it('should handle merge with following from handleBackspace', () => {
        const words = new LinkedList<WordToken>()
        words.add(new WordToken('Hello', 0.9, 1, 2, 1))
        words.add(new WordToken('world,', 0.8, 2, 4, 1))
        words.add(new WordToken('how', 0.7, 4, 6, 1))
        words.add(new WordToken('are', 0.6, 6, 8, 1))
        words.add(new WordToken('you?', 0.5, 8, 10, 1))

        const SPEECHBUBBLE = new SpeechBubble(1, 0, 10, words, 0)

        component.textbox = SPEECHBUBBLE
        fixture.detectChanges()

        component.ngAfterViewInit()

        const EVENT = new KeyboardEvent('keydown', { key: ' ' })

        const SELECTED_SPAN = document.getElementById('0_0')
        const CURRENT_TEXT = 'Hello'
        const SPAN_ID = '0_0'

        if (SELECTED_SPAN) {
            component.handleBackspacePressAtStart(
                SELECTED_SPAN,
                CURRENT_TEXT,
                false,
                SPAN_ID,
                EVENT,
            )
            if (component.textbox.words.head) {
                expect(component.textbox.words.head.data.word).toBe(
                    'Helloworld,',
                )
            }
        }
    })

    it('should handle merge with previous from handleBackspace', () => {
        const words = new LinkedList<WordToken>()
        words.add(new WordToken('Hello', 0.9, 1, 2, 1))
        words.add(new WordToken('world,', 0.8, 2, 4, 1))
        words.add(new WordToken('how', 0.7, 4, 6, 1))
        words.add(new WordToken('are', 0.6, 6, 8, 1))
        words.add(new WordToken('you?', 0.5, 8, 10, 1))

        const SPEECHBUBBLE = new SpeechBubble(1, 0, 10, words, 0)

        component.textbox = SPEECHBUBBLE
        fixture.detectChanges()

        component.ngAfterViewInit()

        const EVENT = new KeyboardEvent('keydown', { key: ' ' })

        const SELECTED_SPAN = document.getElementById('0_1')
        const CURRENT_TEXT = 'world,'
        const SPAN_ID = '0_1'

        if (SELECTED_SPAN) {
            component.handleBackspacePressAtStart(
                SELECTED_SPAN,
                CURRENT_TEXT,
                false,
                SPAN_ID,
                EVENT,
            )
        }
        if (component.textbox.words.head) {
            expect(component.textbox.words.head.data.word).toBe('Helloworld,')
        }
    })

    it('should update word highlight styles based on FontWeight', () => {
        // Create a mock data structure with sample fontWeight values
        const words = new LinkedList<WordToken>()
        words.add(new WordToken('Hello', 0.9, 1, 2, 1))
        words.add(new WordToken('world,', 0.8, 2, 4, 1))
        words.add(new WordToken('how', 0.7, 4, 6, 1))
        words.add(new WordToken('are', 0.6, 6, 8, 1))
        words.add(new WordToken('you?', 0.5, 8, 10, 1))

        const SPEECHBUBBLE = new SpeechBubble(1, 0, 10, words, 0)

        component.textbox = SPEECHBUBBLE
        fixture.detectChanges()

        if (component.textbox.words.head?.next) {
            component.textbox.words.head.next.data.fontWeight = 'bold'
        }

        const mockSpan1 = document.createElement('span')
        mockSpan1.id = '0_0'
        mockSpan1.style.fontWeight = 'normal'

        const mockSpan2 = document.createElement('span')
        mockSpan2.id = '0_1'
        mockSpan2.style.fontWeight = 'normal'

        component.textboxRef.nativeElement.appendChild(mockSpan1)
        component.textboxRef.nativeElement.appendChild(mockSpan2)

        component.updateWordHighlight()

        expect(mockSpan1.style.fontWeight).toBe('normal')

        expect(mockSpan2.style.fontWeight).toBe('bold')
    })
})
