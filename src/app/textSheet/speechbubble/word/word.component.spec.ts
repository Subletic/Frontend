import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { WordComponent } from './word.component';
import { WordToken } from '../../../data/wordToken/wordToken.model';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
    ChangeDetectorRef,
    ElementRef,
    EventEmitter

} from '@angular/core';

describe('WordComponent', () => {
    let component: WordComponent;
    let fixture: ComponentFixture<WordComponent>;
    let debugElement: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WordComponent],
            providers: [ChangeDetectorRef, EventEmitter],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WordComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        component.id = 15;
        component.idParent = 2;
        component.word = new WordToken('Test', 1, 1, 1, 1);
        component.wordPrint = component.word.word;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize properties on ngOnInit', () => {
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.spanID).toBe('2_15');
        expect(component.wordPrint).toBe('Test');
    });

    it('should set event listeners on ngAfterViewInit', () => {
        spyOn(component as any, 'setEventListeners');
        component.ngAfterViewInit();
        fixture.detectChanges();
        expect(component.setEventListeners).toHaveBeenCalled();
    });

    it('should handle space press properly', () => {
        const mockWordSpan = document.createElement('span');
        mockWordSpan.textContent = component.word.word;
        mockWordSpan.id = '2_15';

        const event = new KeyboardEvent('keydown', { code: 'Space' });
        const mockSelection = {
            rangeCount: 1,
            getRangeAt: (index: number) => {
                return document.createRange();
            }
        };

        Object.defineProperty(event, 'target', { value: mockWordSpan });
        Object.defineProperty(window, 'getSelection', { value: () => mockSelection });

        spyOn(component, 'handleSpacePress');
        component.handleKeydownEvent(event);
        expect(component.handleSpacePress).toHaveBeenCalled();
    });

    it('should handle backspace press at start properly', () => {
        const mockWordSpan = document.createElement('span');
        mockWordSpan.textContent = component.word.word;
        mockWordSpan.id = '2_15';

        const event = new KeyboardEvent('keydown', { code: 'Backspace' });
        const mockSelection = {
            rangeCount: 1,
            getRangeAt: (index: number) => document.createRange()
        };

        Object.defineProperty(event, 'target', { value: mockWordSpan });
        Object.defineProperty(window, 'getSelection', { value: () => mockSelection });

        spyOn(component, 'handleBackspacePressAtStart').and.callThrough();
        component.handleKeydownEvent(event);
        expect(component.handleBackspacePressAtStart).toHaveBeenCalled();
    });


    it('should emit events on space press', () => {
        const mockWordSpan = document.createElement('span');
        mockWordSpan.textContent = component.word.word;
        mockWordSpan.id = '2_15';

        const event = new KeyboardEvent('keydown', { code: 'Space' });
        const mockSelection = {
            rangeCount: 1,
            getRangeAt: (index: number) => {
                const range = document.createRange();
                if (mockWordSpan.firstChild)
                    range.setStart(mockWordSpan.firstChild, 2);
                return range;

            }
        };

        Object.defineProperty(event, 'target', { value: mockWordSpan });
        Object.defineProperty(window, 'getSelection', { value: () => mockSelection });

        component.selfRef = {
            nativeElement: mockWordSpan
        };
        fixture.detectChanges();

        spyOn(component.dataUpdate, 'emit');
        spyOn(component.newWordAfter, 'emit');
        component.handleKeydownEvent(event);

        const EXPECTED_WORD = new WordToken('Te', 1, 1, 1, 1);

        expect(component.dataUpdate.emit).toHaveBeenCalledWith({ changedWord: EXPECTED_WORD, idOfEmitter: 15 });
        expect(component.newWordAfter.emit).toHaveBeenCalledWith({ wordAfter: 'st', idOfEmitter: 15 });
    });

    it('should emit events on backspace press at start', () => {
        const mockWordSpan = document.createElement('span');
        mockWordSpan.textContent = component.word.word;
        mockWordSpan.id = '2_15';

        const event = new KeyboardEvent('keydown', { code: 'Backspace' });
        const mockSelection = {
            rangeCount: 1,
            getRangeAt: (index: number) => document.createRange()
        };

        Object.defineProperty(event, 'target', { value: mockWordSpan });
        Object.defineProperty(window, 'getSelection', { value: () => mockSelection });

        spyOn(component.deleteSelf, 'emit');
        spyOn(component.addSelfToPrevWord, 'emit');
        component.handleKeydownEvent(event);
        expect(component.deleteSelf.emit).toHaveBeenCalledWith({ idOfEmitter: 15 });
        expect(component.addSelfToPrevWord.emit).toHaveBeenCalledWith({ idOfEmitter: 15 });
    });

    it('should update word on keyup', () => {
        spyOn(component, 'updateWord').and.callThrough();
        spyOn(component.dataUpdate, 'emit');
        const mockWordSpan = document.createElement('span');
        mockWordSpan.textContent = 'Test';
        mockWordSpan.id = '2_15';

        component.selfRef.nativeElement.textContent = 'Testt';

        const keyupEvent = new KeyboardEvent('keyup', { key: 't' });
        component.selfRef.nativeElement.dispatchEvent(keyupEvent);


        expect(component.updateWord).toHaveBeenCalled();
        expect(component.word.word).toBe('Testt');
        expect(component.dataUpdate.emit).toHaveBeenCalledWith({ changedWord: component.word, idOfEmitter: 15 });
    });

    it('should emit addSelfToPrevWord event on backspace press at start with previous word', () => {
        spyOn(component.addSelfToPrevWord, 'emit');
        component.wordPrint = 'Test';
        component.handleBackspacePressAtStart(false);
        expect(component.addSelfToPrevWord.emit).toHaveBeenCalledWith({ idOfEmitter: 15 });
    });

    it('should emit deleteSelf event on backspace press at start with full selection', () => {
        spyOn(component.deleteSelf, 'emit');
        component.wordPrint = 'Test';
        component.handleBackspacePressAtStart(true);
        expect(component.deleteSelf.emit).toHaveBeenCalledWith({ idOfEmitter: 15 });
    });

    it('should not emit any events on keydown event with unsupported key', () => {

        const mockWordSpan = document.createElement('span');
        mockWordSpan.textContent = component.word.word;
        mockWordSpan.id = '2_15';

        const event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
        const mockSelection = {
            rangeCount: 1,
            getRangeAt: (index: number) => document.createRange()
        };

        Object.defineProperty(event, 'target', { value: mockWordSpan });
        Object.defineProperty(window, 'getSelection', { value: () => mockSelection });

        spyOn(component.dataUpdate, 'emit');
        spyOn(component.newWordAfter, 'emit');
        spyOn(component.deleteSelf, 'emit');
        spyOn(component.addSelfToPrevWord, 'emit');
        component.handleKeydownEvent(event);
        expect(component.dataUpdate.emit).not.toHaveBeenCalled();
        expect(component.newWordAfter.emit).not.toHaveBeenCalled();
        expect(component.deleteSelf.emit).not.toHaveBeenCalled();
        expect(component.addSelfToPrevWord.emit).not.toHaveBeenCalled();
    });

    it('should emit deleteSelf event on backspace press at start with full selection and no previous word', () => {
        spyOn(component.deleteSelf, 'emit');
        component.wordPrint = 'Test';
        component.handleBackspacePressAtStart(true);
        expect(component.deleteSelf.emit).toHaveBeenCalledWith({ idOfEmitter: 15 });
    });

    it('should handleKeydownEvent on keydown', () => {
        spyOn(component, 'handleKeydownEvent');
        const mockWordSpan = document.createElement('span');
        mockWordSpan.textContent = 'Test';
        mockWordSpan.id = '2_15';

        component.selfRef.nativeElement.textContent = 'Test';

        const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
        component.selfRef.nativeElement.dispatchEvent(keydownEvent);


        expect(component.handleKeydownEvent).toHaveBeenCalledWith(keydownEvent);
    });

    it('should not emit events on space press if WORD_BEFORE_CURSOR is empty', () => {
        const mockWordSpan = document.createElement('span');
        mockWordSpan.textContent = component.word.word;
        mockWordSpan.id = '2_15';

        const event = new KeyboardEvent('keydown', { code: 'Space' });
        const mockSelection = {
            rangeCount: 1,
            getRangeAt: (index: number) => {
                const range = document.createRange();
                if (mockWordSpan.firstChild)
                    range.setStart(mockWordSpan.firstChild, 0);
                return range;

            }
        };

        Object.defineProperty(event, 'target', { value: mockWordSpan });
        Object.defineProperty(window, 'getSelection', { value: () => mockSelection });

        component.selfRef = {
            nativeElement: mockWordSpan
        };
        fixture.detectChanges();

        spyOn(component.dataUpdate, 'emit');
        spyOn(component.newWordAfter, 'emit');
        component.handleKeydownEvent(event);

        expect(component.dataUpdate.emit).not.toHaveBeenCalled;
        expect(component.newWordAfter.emit).not.toHaveBeenCalled;
    });


});

