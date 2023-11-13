import { Component, Output, EventEmitter } from '@angular/core';
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
    @Output() continueToEditorEvent = new EventEmitter<void>();

    constructor() {

        this.dictionary = new dictionary({
            language: 'en',
            additional_vocab: [
                { content: 'gnocchi', sounds_like: ['nyohki', 'nokey', 'nochi'] },
                { content: 'CEO', sounds_like: ['C.E.O.'] }
            ]
        });
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

    sortAlphabetically(): void {
        this.dictionary.sortAlphabetically();
    }

    sortReverseAlphabetically(): void {
        this.dictionary.sortReverseAlphabetically();
    }

    //Testzwecke
    outputData(): void {
        console.log(JSON.stringify(this.dictionary));
    }

    //Should call help window later
    callHelp(): void {

    }

    continueToEditor(): void {
        // Methode, die aufgerufen wird, wenn der "Weiter zum Livestream-Editor" Button geklickt wird
        this.continueToEditorEvent.emit();
    }

}
