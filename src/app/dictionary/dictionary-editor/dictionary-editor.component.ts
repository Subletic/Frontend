import { Component } from '@angular/core';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';
import { DictionaryRowComponent } from '../dictionary-row/dictionary-row.component';
import { dictionary } from 'src/app/data/dictionary/dictionary.model';

@Component({
    selector: 'app-dictionary-editor',
    templateUrl: './dictionary-editor.component.html',
    styleUrls: ['./dictionary-editor.component.scss'],
})
export class DictionaryEditorComponent {

    dictionary: dictionary;

    constructor() {

        this.dictionary = {
            transcription_config: {
                language: 'en',
                additional_vocab: [
                    { content: 'gnocchi', sounds_like: ['nyohki', 'nokey', 'nochi'] },
                    { content: 'CEO', sounds_like: ['C.E.O.'] }
                ]
            }
        };
    }

    addRow(): void {
        this.dictionary.transcription_config.additional_vocab.push({ content: '', sounds_like: [''] });
    }


    onDeleteRow(row: additional_vocab): void {
        const index = this.dictionary.transcription_config.additional_vocab.indexOf(row);
        if (index !== -1) {
            this.dictionary.transcription_config.additional_vocab.splice(index, 1);
        }
    }

    //Testzwecke
    outputData(): void {
        console.log(JSON.stringify(this.dictionary));
    }


}
