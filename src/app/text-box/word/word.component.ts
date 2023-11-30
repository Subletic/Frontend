import { Component, Input, ViewChild, ElementRef, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import { WordToken } from '../../data/wordToken/wordToken.model';

@Component({
    selector: 'app-word-component',
    templateUrl: './word.component.html',
    styleUrls: ['./word.component.scss'],
})
export class WordComponent implements OnInit, AfterViewInit {

    @Input() word!: WordToken;
    @Input() id!: number;
    @Input() idParent!: number;
    spanID!: string;

    @Output() dataUpdate: EventEmitter<{ changedWord: WordToken, idOfEmitter: number }> = new EventEmitter<{ changedWord: WordToken, idOfEmitter: number }>();
    @Output() newWordAfter: EventEmitter<{ wordAfter: string, idOfEmitter: number }> = new EventEmitter<{ wordAfter: string, idOfEmitter: number }>();

    @ViewChild('self', { static: true }) selfRef!: ElementRef;

    ngOnInit(): void {
        this.spanID = `${this.idParent}_${this.id}`;
    }

    ngAfterViewInit(): void {

        this.selfRef.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {

            this.handleKeydownEvent(event);
        })
    }

    public handleKeydownEvent(event: KeyboardEvent): void {
        const SELECTED_SPAN = event.target as HTMLElement;
        //lint
        //const CURRENT_TEXT = SELECTED_SPAN.textContent;
        const CURSOR_POSITION = window.getSelection()?.getRangeAt(0)?.startOffset;

        //not yet used, lint
        //const SPAN_ID = SELECTED_SPAN.id;
        //const IS_IN_FULL_SELECTION = window.getSelection()?.toString().length === CURRENT_TEXT?.length;

        if (event.code === 'Space') {
            this.handleSpacePress(SELECTED_SPAN, CURSOR_POSITION, event);
        }

        /*
        später
        
        if (CURSOR_POSITION === 0 && event.key === 'Backspace') {
          this.handleBackspacePressAtStart(SELECTED_SPAN, CURRENT_TEXT, IS_IN_FULL_SELECTION, SPAN_ID, event)
        }
        */
    }

    /**
     * Function should be called whenever there is a change made to the data of the "word" attribute.
     */
    public onDataChange() {
        if (!this.id) return;
        this.dataUpdate.emit({ changedWord: this.word, idOfEmitter: this.id });
    }

    /**
    * This function handles the case when the Space key is pressed inside a word.
    * Splits the current word into two words at the cursor position.
    * If the text before the cursor is not empty, a new
    * word is inserted after the current word in the speechbubble (via emitting call).
    * 
    * @param selectedSpan - The event target as an HTMLElement
    * @param cursorPosition - The cursor position at the time of the call
    * @param event - The keyboard event triggered by user.
    */
    public handleSpacePress(selectedSpan: HTMLElement, cursorPosition: number | undefined, event: KeyboardEvent): void {

        const WORD_BEFORE_CURSOR = this.selfRef.nativeElement.textContent.substring(0, cursorPosition);
        const WORD_AFTER_CURSOR = this.selfRef.nativeElement.textContent.substring(cursorPosition);

        if (WORD_BEFORE_CURSOR.trim() == '') return;

        this.word.word = WORD_BEFORE_CURSOR;
        this.word.confidence = 1;

        this.dataUpdate.emit({ changedWord: this.word, idOfEmitter: this.id });
        this.newWordAfter.emit({ wordAfter: WORD_AFTER_CURSOR, idOfEmitter: this.id });

        selectedSpan.textContent = this.word.word;

        event.preventDefault();
    }



}
