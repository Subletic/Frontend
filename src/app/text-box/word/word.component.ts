import { Component, Input } from '@angular/core';
import { WordToken } from '../../data/wordToken/wordToken.model';

@Component({
    selector: 'app-word-component',
    templateUrl: './word.component.html',
    styleUrls: ['./word.component.scss'],
})
export class WordComponent {

    @Input() word: WordToken;
    @Input() id: number;

    constructor() {
        this.word = new WordToken("", 1, 0, 0, 0);
        this.id = 0;
    }


}
